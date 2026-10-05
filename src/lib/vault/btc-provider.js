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
  signatureValidator,
  toXOnly
} from './clients/utils/bitcoin-utils';
import { coinSelection } from './clients/coin-selection/coin-selection';
import { txhexToElectrumTransaction } from './clients/utils/electrum-utils';

const blockchain = Blockchain.BTC;

const SEQUENCE_RBF_ENABLED = 0xffffffff - 2;

// Network fee always set to fast
const BTC_FEE_RATE = 1;

const TAPROOT_DESCRIPTOR_PREFIX = 'tr(';

// Control block: 1 byte leaf version and parity + 32 byte internal key, followed by a 32 byte hash per tree level
const TAPROOT_CONTROL_BLOCK_BASE_SIZE = 33;

const UNSUPPORTED_TAPROOT_DESCRIPTOR = 'UnsupportedTaprootDescriptor';

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

// Parse the keys in a leaf. Only plain 2-key leaves are supported, i.e. `and_v(v:pk([origin]key),pk([origin]key))`
const LEAF_KEY = '\\[([^\\]]*)\\]([0-9a-fA-F]{64}|[0-9a-fA-F]{66})';
const LEAF_FORMAT = new RegExp(`^and_v\\(v:pk\\(${LEAF_KEY}\\),pk\\(${LEAF_KEY}\\)\\)$`);

const parseLeafKeys = leafExpression => {
  const match = leafExpression.replace(/\s+/g, '').match(LEAF_FORMAT);

  if (!match) {
    throw new Error(UNSUPPORTED_TAPROOT_DESCRIPTOR);
  }

  return [
    [match[1], match[2]],
    [match[3], match[4]]
  ].map(([origin, publicKey]) => {
    const [fingerprint, ...paths] = origin.split('/');

    return { fingerprint, path: `m/${paths.join('/')}`, publicKey };
  });
};

// Parse the internal key (x-only or compressed, optionally prefixed with its key origin) as an x-only buffer
const parseInternalKey = internalKey => {
  const hex = internalKey.trim().replace(/^\[[^\]]*\]/, '');

  if (!/^([0-9a-fA-F]{64}|[0-9a-fA-F]{66})$/.test(hex)) {
    throw new Error(UNSUPPORTED_TAPROOT_DESCRIPTOR);
  }

  return toXOnly(Buffer.from(hex, 'hex'));
};

// Parse branches and leaf keys
const parseTaprootTree = treeString => {
  const trimmed = treeString.trim();

  if (trimmed.startsWith('{')) {
    const children = splitTopLevel(trimmed.slice(1, -1), ',');

    if (children.length !== 2) {
      throw new Error(UNSUPPORTED_TAPROOT_DESCRIPTOR);
    }

    return children.map(parseTaprootTree);
  }

  return { keys: parseLeafKeys(trimmed) };
};

// Parse descriptor internal key and script tree
const parseTaprootDescriptor = descriptor => {
  const trimmed = descriptor.trim();
  const inner = trimmed.slice(TAPROOT_DESCRIPTOR_PREFIX.length, trimmed.lastIndexOf(')'));
  const [internalKey, ...treeParts] = splitTopLevel(inner, ',');

  if (treeParts.length === 0) {
    throw new Error(UNSUPPORTED_TAPROOT_DESCRIPTOR);
  }

  return { internalKey: parseInternalKey(internalKey), tree: parseTaprootTree(treeParts.join(',')) };
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

  async calculateTransactionFee(from, descriptor) {
    const feeRate = await this.instance.estimateFee(BTC_FEE_RATE);
    const utxos = await this.getSpendableUtxos(from, descriptor);
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
    const utxos = await this.getSpendableUtxos(from, descriptor);

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

  // Taproot vault inputs are always script-path spends, whose witness grows with the depth of the spend leaf
  async getSpendableUtxos(from, descriptor) {
    const utxos = await this.instance.getAddressUTXOs(from);

    if (!isTaprootDescriptor(descriptor)) {
      return utxos;
    }

    const { controlBlock } = this.getTaprootData(descriptor);
    const scriptPathDepth = (controlBlock.length - TAPROOT_CONTROL_BLOCK_BASE_SIZE) / 32;

    return utxos.map(utxo => ({ ...utxo, scriptPathDepth }));
  }

  // Get funding address, spendable path, and control block from descriptor
  getTaprootData(descriptor) {
    const { internalKey, tree } = parseTaprootDescriptor(descriptor);
    const leaves = collectTaprootLeaves(tree);

    // Supported descriptors have a script tree of nested branches (exactly two children each) whose leaves are all
    // plain 2-key `and_v(v:pk(..),pk(..))` leaves; anything else is rejected while parsing. The first two leaves
    // identify the roles, by convention { normal(vault,platform), { recovery(recovery,platform), ... } } where, with
    // inheritance, the remaining leaves are { vault+recovery, platform+beneficiary }: platform is
    // whichever key those two leaves share, and vault and recovery are each leaf's other key. Vault Assist Tool only
    // ever holds the vault and recovery/backup keys, so it must spend through the leaf pairing exactly those two,
    // which must exist somewhere in the tree. Counting how many leaves each key appears in would be ambiguous as soon
    // as a further leaf exists, since platform then appears in more leaves than vault or recovery do.
    const [normalLeaf, recoveryLeaf] = leaves;
    const platformKey =
      normalLeaf &&
      recoveryLeaf &&
      normalLeaf.keys.find(key => recoveryLeaf.keys.some(other => other.publicKey === key.publicKey));

    if (!platformKey) {
      throw new Error('NoSignableTaprootLeaf');
    }

    const vaultKey = normalLeaf.keys.find(key => key.publicKey !== platformKey.publicKey);
    const recoveryKey = recoveryLeaf.keys.find(key => key.publicKey !== platformKey.publicKey);

    const spendLeafNode = leaves.find(
      leaf =>
        leaf.keys.length === 2 &&
        leaf.keys.some(key => key.publicKey === vaultKey.publicKey) &&
        leaf.keys.some(key => key.publicKey === recoveryKey.publicKey)
    );

    if (!spendLeafNode) {
      throw new Error('NoSignableTaprootLeaf');
    }

    const spendLeaf = buildTapLeaf(spendLeafNode.keys[0].publicKey, spendLeafNode.keys[1].publicKey);
    const { address, controlBlock, output } = getTaproot(
      this.network,
      internalKey,
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
