/* eslint-disable id-length */
import { Blockchain, NetworkUtil } from '../../network';
import * as bitcoin from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';
import reverse from 'buffer-reverse';

const network = NetworkUtil.getNetwork(Blockchain.BTC) as bitcoin.Network;

export interface TransactionOutput {
  address: string;
  value: string;
  script?: Buffer;
}

export interface TransactionInput {
  address: string;
  value: string;
  sequence: number;
  txHex?: string;
  txid: string;
  vout: number;
}

export interface AddressTransaction {
  height: number;
  hash: string;
  fee: string;
  confirmations: number;
  time: number;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
}

export interface TxIn {
  coinbase?: string;
  scriptSig: { asm: string; hex: string };
  sequence: number;
  txid: string;
  txinwitness: string[];
  vout: number;
}

export interface TxOut {
  // eslint-disable-next-line id-length
  n: number;
  scriptPubKey: {
    addresses?: string[];
    address?: string;
    asm?: string;
    hex?: string;
    type?: string;
  };
  value: number;
}

export interface ElectrumUtxo {
  tx_hash: string;
  tx_pos: string;
  value: number;
  height: number;
}

export interface ElectrumTransaction {
  blockhash: string;
  confirmations: number;
  hash: string;
  hex: string;
  locktime: number;
  size: number;
  txid: string;
  time: any;
  version: number;
  vin: TxIn[];
  vout: TxOut[];
  vsize: number;
  weight: number;
}

export interface AddressType {
  address: string | undefined;
  type: string | undefined;
}

function segwitBech32ScriptPubKeyToAddress(scriptPubKey: string): string | undefined {
  try {
    const output = Buffer.from(scriptPubKey, 'hex');

    return bitcoin.payments.p2wpkh({
      network,
      output
    }).address;
  } catch (_) {
    return undefined;
  }
}

function pubKeyToAddress(scriptPubKey: string): string | undefined {
  try {
    const output = Buffer.from(scriptPubKey, 'hex');

    return bitcoin.payments.p2pkh({
      network,
      output
    }).address;
  } catch (_) {
    return undefined;
  }
}

function scriptHashToAddress(scriptPubKey: string): string | undefined {
  try {
    const output = Buffer.from(scriptPubKey, 'hex');

    return bitcoin.payments.p2sh({
      network,
      output
    }).address;
  } catch (_) {
    return undefined;
  }
}

function taprootScriptPubKeyToAddress(scriptPubKey: string): string | undefined {
  try {
    const publicKey = Buffer.from(scriptPubKey, 'hex');

    return bitcoin.address.fromOutputScript(publicKey, network);
  } catch (_) {
    return undefined;
  }
}

function getAddressType(script: string): AddressType {
  let address: string | undefined;

  address = segwitBech32ScriptPubKeyToAddress(script);
  if (address) {
    return { address, type: 'witness_v0_keyhash' };
  }

  address = scriptHashToAddress(script);
  if (address) {
    return { address, type: 'scripthash' };
  }

  address = pubKeyToAddress(script);
  if (address) {
    return { address, type: 'pubkeyhash' };
  }

  address = taprootScriptPubKeyToAddress(script);
  if (address) {
    return { address, type: 'witness_v0_scripthash' };
  }

  return { address, type: undefined };
}

export function txhexToElectrumTransaction(txhex: string): ElectrumTransaction {
  const tx = bitcoin.Transaction.fromHex(txhex);

  const ret: ElectrumTransaction = {
    blockhash: '',
    confirmations: 0,
    hash: tx.getHash().toString('hex'),
    hex: txhex,
    locktime: tx.locktime,
    size: Math.ceil(txhex.length / 2),
    time: 0,
    txid: tx.getId(),
    version: tx.version,
    vin: [],
    vout: [],
    vsize: tx.virtualSize(),
    weight: tx.weight()
  };

  for (const input of tx.ins) {
    const txinwitness = input.witness.map(item => item.toString('hex'));

    ret.vin.push({
      scriptSig: { asm: '', hex: input.script.toString('hex') },
      sequence: input.sequence,
      txid: reverse(input.hash).toString('hex'),
      txinwitness,
      vout: input.index
    });
  }

  let i = 0;

  for (const out of tx.outs) {
    const value = new BigNumber(out.value).dividedBy(100000000).toNumber();
    const hex = out.script.toString('hex');
    const { address, type }: AddressType = getAddressType(hex);

    ret.vout.push({
      // eslint-disable-next-line id-length
      n: i,
      scriptPubKey: {
        address,
        asm: '',
        hex,
        type
      },
      value
    });

    i++;
  }

  return ret;
}
