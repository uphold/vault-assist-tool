import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from '@bitcoinerlab/secp256k1';
import { ECPairFactory } from 'ecpair';
import BigNumber from 'bignumber.js';

bitcoin.initEccLib(ecc);

export const TAPROOT_LEAF_VERSION = 0xc0;

export interface Participant {
  fingerprint?: string;
  path: string;
  publicKey: string;
}

export const ECPair = ECPairFactory(ecc);

export const toXOnly = (pubkey: Buffer): Buffer => Buffer.from(pubkey.length === 32 ? pubkey : pubkey.subarray(1, 33));

export function addressToScripthash(address: string, network: bitcoin.Network): string {
  const script = bitcoin.address.toOutputScript(address, network);
  const hash = bitcoin.crypto.sha256(script);
  const reversedHash = Buffer.from(hash.reverse());

  return reversedHash.toString('hex');
}

export const signatureValidator = (pubkey: Buffer, msghash: Buffer, signature: Buffer): boolean =>
  pubkey.length === 32
    ? ecc.verifySchnorr(msghash, pubkey, signature.subarray(0, 64))
    : ECPair.fromPublicKey(pubkey).verify(msghash, signature);

export const satsToBtc = (sats: BigNumber.Value): string => new BigNumber(sats || 0).dividedBy(1e8).toString();
export const btcToSats = (btc: BigNumber.Value): string => new BigNumber(btc || 0).times(1e8).toString();

export function isValidAddress(network: bitcoin.Network, address: string): boolean {
  try {
    bitcoin.address.toOutputScript(address, network);

    return true;
  } catch (error) {
    return false;
  }
}

export function getRedeemScript(network: bitcoin.Network, participants: Participant[], threshold: number) {
  // The public keys in the redeem script are sorted as per BIP-67 (https://github.com/bitcoin/bips/blob/master/bip-0067.mediawiki)
  const pubkeys = participants
    .map(participant => Buffer.from(participant.publicKey, 'hex'))
    .sort((pubkeyA, pubkeyB) => pubkeyA.compare(pubkeyB));

  // eslint-disable-next-line id-length
  return bitcoin.payments.p2ms({ m: threshold, network, pubkeys });
}

export type Taptree = { output: Buffer } | [Taptree, Taptree];

export function buildTapLeaf(publicKeyA: string, publicKeyB: string): Buffer {
  return bitcoin.script.compile([
    toXOnly(Buffer.from(publicKeyA, 'hex')),
    bitcoin.opcodes.OP_CHECKSIGVERIFY,
    toXOnly(Buffer.from(publicKeyB, 'hex')),
    bitcoin.opcodes.OP_CHECKSIG
  ]);
}

// Resolve P2TR output for the whole script tree, plus control block
export function getTaproot(
  network: bitcoin.Network,
  internalPubkey: Buffer,
  scriptTree: Taptree,
  spendLeaf: Buffer
): { address: string; controlBlock: Buffer; output: Buffer } {
  const funding = bitcoin.payments.p2tr({ internalPubkey, network, scriptTree });
  const spend = bitcoin.payments.p2tr({
    internalPubkey,
    network,
    redeem: { output: spendLeaf, redeemVersion: TAPROOT_LEAF_VERSION },
    scriptTree
  });

  const { witness } = spend;

  return {
    address: funding.address as string,
    controlBlock: (witness as Buffer[])[(witness as Buffer[]).length - 1],
    output: funding.output as Buffer
  };
}
