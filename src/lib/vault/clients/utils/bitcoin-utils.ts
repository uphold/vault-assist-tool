import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import BigNumber from 'bignumber.js';

export interface Participant {
  path: string;
  publicKey: string;
}

export const ECPair = ECPairFactory(ecc);

export function addressToScripthash(address: string, network: bitcoin.Network): string {
  const script = bitcoin.address.toOutputScript(address, network);
  const hash = bitcoin.crypto.sha256(script);
  const reversedHash = Buffer.from(hash.reverse());

  return reversedHash.toString('hex');
}

export const signatureValidator = (pubkey: Buffer, msghash: Buffer, signature: Buffer): boolean =>
  ECPair.fromPublicKey(pubkey).verify(msghash, signature);

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
