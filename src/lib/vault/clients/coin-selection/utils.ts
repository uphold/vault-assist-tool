import { AlgorithmResult, Input, Output } from './types';

/**
 * Overhead
 * - 4   : nVersion  The transaction version number
 * - 1   : Input count (compactSize) The number of inputs included in the transaction. 1 byte for up to 252 inputs
 * - 1   : Output count (compactSize) The number of outputs included in the transaction. 1 byte for up to 252 outputs
 * - 4   : nLockTime  The earliest epoch time or block height when the transaction may be included in a block
 *
 * (Only in transactions spending one or more segwit UTXOs:)
 * - 0.5 : Segwit marker & segwit flag (0.5) A byte sequence used to clearly differentiate segwit transactions from legacy transactions
 */
export const TX_EMPTY_SIZE = 4 + 1 + 1 + 4;
export const TX_SEGWIT_MARKER_SIZE = 0.5;

/**
 * Input base
 * - 32 + 4 : Outpoint (36) The txid and vout index number of the output (UTXO) being spent
 * - 1      : scriptSig length (compactSize) The length of the scriptSig field. 1 vbyte for a scriptSig up to 252 vbytes. Maximum of 3 vbytes for a maximum-length scriptSig (10,000 vbytes).
 * - 4      : nSequence The sequence number for the input. Used by BIP68 and BIP125, with other values having no defined meaning
 */

export const TX_INPUT_BASE = 32 + 4 + 1 + 4;

/**
 * Input scriptSig size (varies)
 * - 63.5    : P2SH 2-of-3 (254 / 4) OP_0 OP_PUSH72 <ecdsa_signature> OP_PUSH72 <ecdsa_signature> OP_PUSHDATA1 105 <OP_2 OP_PUSH33 <pubkey> OP_PUSH33 <pubkey> OP_PUSH33 <pubkey> OP_3 OP_CHECKMULTISIG>
 */

export const TX_INPUT_P2WSH_2_OF_3 = 63.5;
const TX_INPUT_PUBKEYHASH = 107;
const TX_INPUT_SEGWIT = 27;
const TX_INPUT_SCRIPTHASH = 256;
const TX_INPUT_P2TR = 16.5;

/**
 * Output base
 * - 8 : nValue The amount of bitcoin value being paid
 * - 1 : scriptPubKey length (compactSize) The length of the scriptPubKey field. 1 vbyte for a script up to 252 vbytes. Maximum of 3 vbytes for a maximum-length script (10,000 vbytes).
 */

export const TX_OUTPUT_BASE = 8 + 1;

/**
 * Output scriptPubKey size (varies)
 * - 25 : P2PKH | OP_DUP OP_HASH160 OP_PUSH20 <public_key_hash> OP_EQUALVERIFY OP_CHECKSIG
 * - 22 : P2WPKH | OP_0 OP_PUSH20 <public_key_hash>
 * - 34 : P2WSH 2-of-3 | OP_HASH160 OP_PUSH20 <script_hash> OP_EQUAL
 * - 23 : P2SH 2-of-3 | OP_HASH160 OP_PUSH20 <script_hash> OP_EQUAL
 */

export const TX_OUTPUT_PUBKEYHASH = 25;
export const TX_OUTPUT_P2WSH_2_OF_3 = 34;
const TX_OUTPUT_SEGWIT = 22;
const TX_OUTPUT_SCRIPTHASH = 23;
const TX_OUTPUT_P2TR = 34;

/**
 * Calculates the size in bytes of an input
 */

export const inputBytes = (input: Partial<Input>) => {
  let scriptLength = TX_INPUT_PUBKEYHASH;

  if (input?.address?.startsWith('bc1p')) {
    scriptLength = TX_INPUT_P2TR;
  } else if (
    input?.address?.startsWith('bc1') ||
    input?.address?.startsWith('tb1') ||
    input?.address?.startsWith('bcrt')
  ) {
    scriptLength = input?.address?.length === 42 ? TX_INPUT_SEGWIT : TX_INPUT_P2WSH_2_OF_3;
  } else if (input?.address?.startsWith('3') || input?.address?.startsWith('2')) {
    scriptLength = TX_INPUT_SCRIPTHASH;
  }

  return TX_INPUT_BASE + scriptLength;
};

/**
 * Calculates the size in bytes of an output
 * by determining the script length based on the address format
 */

export const outputBytes = (output: Output) => {
  let scriptLength = TX_OUTPUT_PUBKEYHASH;

  if (output?.address?.startsWith('bc1p')) {
    scriptLength = TX_OUTPUT_P2TR;
  } else if (
    output?.address?.startsWith('bc1') ||
    output?.address?.startsWith('tb1') ||
    output?.address?.startsWith('bcrt')
  ) {
    scriptLength = output?.address?.length === 42 ? TX_OUTPUT_SEGWIT : TX_OUTPUT_P2WSH_2_OF_3;
  } else if (output?.address?.startsWith('3') || output?.address?.startsWith('2')) {
    scriptLength = TX_OUTPUT_SCRIPTHASH;
  }

  return TX_OUTPUT_BASE + scriptLength;
};

// Calculates the dust threshold for an output i.e. the minimum value it must have to be worth more than the fee to spend it.
// This is not perfect - hardcoding per size of input of P2WSH 2 of 3
export const dustThreshold = (feeRate: number): number => (TX_INPUT_BASE + TX_INPUT_P2WSH_2_OF_3) * feeRate;

// Calculates the total transaction size in bytes
export const transactionBytes = (inputs: Input[], outputs: Output[]): number => {
  // Checking if any segwit is spent to add 0.5 bytes for marker
  const isSpendingAnySegwit = inputs?.some(({ address }) => address?.startsWith('bc1') || address?.startsWith('tb1'));

  return (
    TX_EMPTY_SIZE +
    (isSpendingAnySegwit ? TX_SEGWIT_MARKER_SIZE : 0) +
    inputs.reduce((total, input) => total + inputBytes(input), 0) +
    outputs.reduce((total, output) => total + outputBytes(output), 0)
  );
};

// Returns a number or NaN if the input is not a valid number
export const uintOrNaN = (value): number => {
  if (typeof value !== 'number') {
    return NaN;
  }
  if (!isFinite(value)) {
    return NaN;
  }
  if (Math.floor(value) !== value) {
    return NaN;
  }
  if (value < 0) {
    return NaN;
  }

  return value;
};

export const sumForgiving = (range: Output[]) =>
  range.reduce((total, item) => total + (isFinite(item.value) ? item.value : 0), 0);

export const sumOrNaN = (range: (Input | Output)[]) => range.reduce((total, item) => total + uintOrNaN(item.value), 0);

/**
 * Finalizes the coin selection by adding a change output if necessary.
 * It calculates the fee, checks if a change output is needed, and returns
 * the finalized inputs and outputs.
 * @param {Input[]} inputs - The transaction inputs.
 * @param {Output[]} outputs - The transaction outputs.
 * @param {number} feeRate - The fee rate for the transaction.
 * @returns {Result} The finalized inputs and outputs.
 */

export const finalize = (inputs: Input[], outputs: Output[], feeRate: number): AlgorithmResult => {
  const totalBytes = transactionBytes(inputs, outputs);

  // Size hardcoded because our output is always for our P2WSH Multisig 2 of 3
  const feeAfterExtraOutput = feeRate * (totalBytes + TX_OUTPUT_BASE + TX_OUTPUT_P2WSH_2_OF_3);
  const calculatedTotalChange = sumOrNaN(inputs) - (sumOrNaN(outputs) + Math.ceil(feeAfterExtraOutput));

  // Add a change output if is worth it (higher then dust threshold)
  if (calculatedTotalChange > dustThreshold(feeRate)) {
    outputs = outputs.concat({ value: Math.floor(calculatedTotalChange) });
  }

  // Recalculate the fee after adding the change output
  const fee = sumOrNaN(inputs) - sumOrNaN(outputs);

  if (!isFinite(fee)) {
    throw new Error('InvalidFee');
  }

  return {
    fee: Math.ceil(fee),
    inputs,
    outputs
  };
};

export const utxoScore = (utxo: Input, feeRate: number): number => utxo.value - feeRate * inputBytes(utxo);
