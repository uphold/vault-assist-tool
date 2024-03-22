/* eslint-disable import/no-unresolved */
import './constants';
import * as bitcoin from 'bitcoinjs-lib';
import { Blockchain, WalletService } from 'vault-wallet-toolkit';
import { Electrum } from './clients/electrum/electrum-client';
import { NetworkUtil } from './network';
import { coinSelection } from './clients/coin-selection/coin-selection';
import { getRedeemScript, satsToBtc, signatureValidator } from './clients/utils/bitcoin-utils';
import { txhexToElectrumTransaction } from './clients/utils/electrum-utils';

const blockchain = Blockchain.BTC;

// signer requirements for multisig vault
const threshold = 2;

const SEQUENCE_RBF_ENABLED = 0xffffffff - 2;

// Network fee always set to fast
const BTC_FEE_RATE = 1;

export const { signTransaction } = WalletService;

class BitcoinProvider {
  constructor() {
    this.network = NetworkUtil.getNetwork(blockchain);
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
    const redeem = this.getRedeemScriptFromDescriptor(descriptor);

    psbt.addInputs(
      inputs.map(input => {
        const etx = txhexToElectrumTransaction(input.hex);

        return {
          hash: input.txid,
          index: input.vout,
          sequence: SEQUENCE_RBF_ENABLED,
          witnessScript: redeem.output,
          witnessUtxo: {
            script: Buffer.from(etx.vout[input.vout].scriptPubKey.hex, 'hex'),
            value: input.value
          }
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

    return getRedeemScript(this.network, participants, threshold);
  }

  getSignersFromDescriptor(descriptor) {
    const participants = this.getParticipantsFromDescriptor(descriptor);

    return participants.map(participant => this.deriveAddress(participant.publicKey));
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
