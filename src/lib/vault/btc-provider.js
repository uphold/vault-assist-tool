/* eslint-disable import/no-unresolved */
import './constants';
import * as bitcoin from 'bitcoinjs-lib';
import { SupportedBlockchain as Blockchain, signTransaction } from 'vault-wallet-toolkit';
import { DEFAULT_MULTISIG_SIGNERS_REQUIRED, getNetwork } from './network';
import { Electrum } from './clients/electrum/electrum-client';
import {
  TAPROOT_LEAF_VERSION,
  buildTapLeaf,
  getRedeemScript,
  getTaproot,
  satsToBtc,
  signatureValidator
} from './clients/utils/bitcoin-utils';
import { coinSelection } from './clients/coin-selection/coin-selection';
import { txhexToElectrumTransaction } from './clients/utils/electrum-utils';

const blockchain = Blockchain.BTC;

const SEQUENCE_RBF_ENABLED = 0xffffffff - 2;

// Network fee always set to fast
const BTC_FEE_RATE = 1;

const TAPROOT_DESCRIPTOR_PREFIX = 'tr(';

const isTaprootDescriptor = descriptor => descriptor.trimStart().startsWith(TAPROOT_DESCRIPTOR_PREFIX);

// Parse top level of taproot output descriptor
const splitTopLevel = (str, separator) => {
  const parts = [];
  let depth = 0;
  let current = '';

  for (const char of str) {
    if (char === '(' || char === '{') {
      depth += 1;
    } else if (char === ')' || char === '}') {
      depth -= 1;
    }

    if (char === separator && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  parts.push(current);

  return parts;
};

// Find the vault & recovery fingerprints in the output descriptor
const isFingerprint = ({ fingerprint }) => /^[0-9a-f]{8}$/i.test(fingerprint);

// Parse the keys in a leaf
const parseLeafKeys = leafExpression =>
  [...leafExpression.matchAll(/pk\(\[([^\]]*)\]([0-9a-fA-F]+)\)/g)].map(([, origin, publicKey]) => {
    const [fingerprint, ...paths] = origin.split('/');

    return { fingerprint, path: `m/${paths.join('/')}`, publicKey };
  });

// Parse branches and leaf keys
const parseTaprootTree = treeString => {
  const trimmed = treeString.trim();

  if (trimmed.startsWith('{')) {
    const [left, right] = splitTopLevel(trimmed.slice(1, -1), ',');

    return [parseTaprootTree(left), parseTaprootTree(right)];
  }

  return { keys: parseLeafKeys(trimmed) };
};

// Parse descriptor internal key and script tree
const parseTaprootDescriptor = descriptor => {
  const trimmed = descriptor.trim();
  const inner = trimmed.slice(TAPROOT_DESCRIPTOR_PREFIX.length, trimmed.lastIndexOf(')'));
  const [internalKey, ...treeParts] = splitTopLevel(inner, ',');

  return { internalKey: internalKey.trim(), tree: parseTaprootTree(treeParts.join(',')) };
};

// Flattens the parsed tree into leaves
const collectTaprootLeaves = tree =>
  Array.isArray(tree) ? [...collectTaprootLeaves(tree[0]), ...collectTaprootLeaves(tree[1])] : [tree];

// Rebuild bitcoinjs-lib's taptree from the parsed tree
const buildTaprootScriptTree = tree =>
  Array.isArray(tree)
    ? [buildTaprootScriptTree(tree[0]), buildTaprootScriptTree(tree[1])]
    : { output: buildTapLeaf(tree.keys[0].publicKey, tree.keys[1].publicKey) };

class BitcoinProvider {
  constructor() {
    this.network = getNetwork(blockchain);
    this.instance = new Electrum(this.network);
  }

  async calculateTransactionFee(from) {
    const feeRate = await this.instance.estimateFee(BTC_FEE_RATE);
    const utxos = await this.instance.getAddressUTXOs(from);
    const { fee } = coinSelection(utxos, [{ address: from }], Number(feeRate));

    return satsToBtc(fee);
  }

  createPsbt(inputs, outputs, descriptor) {
    const psbt = new bitcoin.Psbt({ network: this.network });
    const taproot = isTaprootDescriptor(descriptor) ? this.getTaprootData(descriptor) : null;
    const redeem = taproot ? null : this.getRedeemScriptFromDescriptor(descriptor);

    psbt.addInputs(
      inputs.map(input => {
        const etx = txhexToElectrumTransaction(input.hex);
        const witnessUtxo = {
          script: Buffer.from(etx.vout[input.vout].scriptPubKey.hex, 'hex'),
          value: input.value
        };

        if (taproot) {
          // Taproot script-path spend: prove the spendable leaf belongs to the tree via its control block
          return {
            hash: input.txid,
            index: input.vout,
            sequence: SEQUENCE_RBF_ENABLED,
            tapLeafScript: [
              { controlBlock: taproot.controlBlock, leafVersion: TAPROOT_LEAF_VERSION, script: taproot.spendLeaf }
            ],
            witnessUtxo
          };
        }

        return {
          hash: input.txid,
          index: input.vout,
          sequence: SEQUENCE_RBF_ENABLED,
          witnessScript: redeem.output,
          witnessUtxo
        };
      })
    );

    psbt.addOutputs(
      outputs.map(output => {
        return {
          address: output?.address ?? this.multisig.address,
          value: output?.value
        };
      })
    );

    return psbt;
  }

  async createTransaction({ to, from, descriptor }) {
    const utxos = await this.instance.getAddressUTXOs(from);

    if (utxos.length === 0) {
      throw new Error('InsufficientFunds');
    }

    // Always use fast fee rate
    const feeRate = await this.instance.estimateFee(BTC_FEE_RATE);

    // This means we will send all the funds to the destination
    const output = [{ address: to }];

    try {
      const result = coinSelection(utxos, output, Number(feeRate));
      const { inputs, outputs, error } = result;

      if (error) {
        throw new Error(error);
      }

      const psbt = this.createPsbt(inputs, outputs, descriptor);

      return psbt.toHex();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  deriveAddress(publicKey) {
    return bitcoin.payments.p2wpkh({ network: this.network, pubkey: Buffer.from(publicKey, 'hex') }).address;
  }

  deriveMultisigAddress(descriptor) {
    if (isTaprootDescriptor(descriptor)) {
      return this.getTaprootData(descriptor).address;
    }

    const redeem = this.getRedeemScriptFromDescriptor(descriptor);
    const { address } = bitcoin.payments.p2wsh({ network: this.network, redeem });

    return address;
  }

  async getAddressBalance(address) {
    const { confirmed, unconfirmed } = await this.instance.getAddressBalance(address);

    const balance = confirmed + unconfirmed;

    if (balance <= 0) {
      throw new Error('InsufficientFunds');
    }

    return satsToBtc(balance);
  }

  async getFee() {
    const fee = await this.instance.estimateFee(BTC_FEE_RATE);

    return satsToBtc(fee);
  }

  getParticipantsFromDescriptor(descriptor) {
    if (isTaprootDescriptor(descriptor)) {
      const { tree } = parseTaprootDescriptor(descriptor);
      const seen = new Set();
      const participants = [];

      collectTaprootLeaves(tree).forEach(leaf =>
        leaf.keys.forEach(key => {
          if (!seen.has(key.publicKey)) {
            seen.add(key.publicKey);
            participants.push(key);
          }
        })
      );

      return participants;
    }

    const format = new RegExp(/^.sh\(sortedmulti\(2,(.*?)\)\)/);
    const [, multisigString] = descriptor.match(format);
    const [firstKey, ...keyStrings] = multisigString.split(',');
    const signers = keyStrings.map(keyString => {
      const [, pathString] = keyString.match(/\[(.*?)\]/);
      const [fingerprint, ...paths] = pathString.split('/');
      const [, publicKey] = keyString.split(']');

      return {
        fingerprint,
        path: `m/${paths.join('/')}`,
        publicKey
      };
    });

    return [{ publicKey: firstKey }, ...signers];
  }

  getRedeemScriptFromDescriptor(descriptor) {
    const participants = this.getParticipantsFromDescriptor(descriptor);

    return getRedeemScript(this.network, participants, DEFAULT_MULTISIG_SIGNERS_REQUIRED);
  }

  getSignersFromDescriptor(descriptor) {
    const participants = this.getParticipantsFromDescriptor(descriptor);

    return participants.map(participant => this.deriveAddress(participant.publicKey));
  }

  // Get funding address, spendable path, and control block from descriptor
  getTaprootData(descriptor) {
    const { internalKey, tree } = parseTaprootDescriptor(descriptor);
    const leaves = collectTaprootLeaves(tree);

    // Identify vault & recovery keys to use for spendable path
    const occurrences = {};

    leaves.forEach(leaf =>
      leaf.keys.forEach(key => {
        occurrences[key.publicKey] = (occurrences[key.publicKey] ?? 0) + 1;
      })
    );

    const spendLeafNode = leaves.find(leaf =>
      leaf.keys.every(key => isFingerprint(key) && occurrences[key.publicKey] > 1)
    );

    if (!spendLeafNode) {
      throw new Error('NoSignableTaprootLeaf');
    }

    const spendLeaf = buildTapLeaf(spendLeafNode.keys[0].publicKey, spendLeafNode.keys[1].publicKey);
    const { address, controlBlock, output } = getTaproot(
      this.network,
      Buffer.from(internalKey, 'hex'),
      buildTaprootScriptTree(tree),
      spendLeaf
    );

    return { address, controlBlock, output, spendLeaf };
  }

  get isConnected() {
    return this.instance.isConnected();
  }

  multiSignTransaction(tx, keys) {
    let signedTx = tx;

    keys.forEach(key => {
      signedTx = signTransaction(blockchain, key, signedTx, { derivationPath: "m/84'/0'/0'/0/0", multisig: true });
    });

    return signedTx;
  }

  async sendTransaction(encodedTransaction, { to, amount }) {
    const psbt = bitcoin.Psbt.fromHex(encodedTransaction);

    if (!psbt.validateSignaturesOfAllInputs(signatureValidator)) {
      throw new Error('InvalidSignerError');
    }

    psbt.finalizeAllInputs();

    const tx = psbt.extractTransaction();

    await this.instance.broadcastTransaction(tx.toHex());

    return { amount, from: '', hash: tx.getId(), network: blockchain, to };
  }
}

export const bitcoinProvider = new BitcoinProvider();
