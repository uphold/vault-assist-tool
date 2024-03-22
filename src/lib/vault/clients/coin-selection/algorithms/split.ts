import { AlgorithmResult, Input, Output } from '../types';
import { dustThreshold, finalize, sumForgiving, sumOrNaN, transactionBytes } from '../utils';

/**
 * Splits the available unspent transaction outputs (utxos) among the specified outputs,
 * ensuring that outputs without a defined value receive a fair share of the remaining value
 * after deducting the fee.
 * @param {Input[]} utxos - The unspent transaction outputs.
 * @param {Output[]} outputs - The outputs to split the total UTXOS values among.
 * @param {number} feeRate - The fee rate.
 * @returns {Object} An object containing the finalized outputs and the fee.
 * @returns {Result} The finalized transaction.
 * @throws {Error} If the fee rate is invalid or there are insufficient funds.
 */

export const split = (utxos: Input[], outputs: Output[], feeRate: number): AlgorithmResult => {
  // Calculating total transaction bytes
  // including all inputs since we are sending everything
  // and all defined outputs
  const totalBytes = transactionBytes(utxos, outputs);

  // Calculating total fee of transaction
  const totalFee = feeRate * totalBytes;

  // Total value of our utxos
  const inputsTotalValue = sumOrNaN(utxos);

  // We can have e.g. one output with a defined amount (value)
  // and second one without value
  // we calculate total defined amount in outputs that have it
  const outputsTotalValue = sumForgiving(outputs);

  // Now calculate how much amount we have in our inputs
  // so we can split it between outputs without amount (value)
  const remainingValue = inputsTotalValue - outputsTotalValue - totalFee;

  // If the remaining amount is less then zero
  // it means that we want to spend more then we have
  // so we throw an error
  if (!isFinite(remainingValue) || remainingValue < 0) {
    throw new Error('InsufficientFunds');
  }

  // Counting for all outputs that have no value
  const totalOutputsWithoutValue = outputs.reduce((count, output) => count + (output.value === undefined ? 1 : 0), 0);

  // If there are no outputs without value
  // and remaining amount is 0
  // we can finalize this transaction
  if (remainingValue === 0 && totalOutputsWithoutValue === 0) {
    return finalize(utxos, outputs, feeRate);
  }

  // We split the remaining amount between outputs that didn't specify a value
  // e.g. we have 900 and three outputs without value
  // each should receive 300 sats
  const splitRemainingValue = Math.floor(remainingValue / totalOutputsWithoutValue);

  // Ensure that every output has either defined value
  // or split amount is over the threshold
  // Meaning that split remaining value is not less then threshold
  if (!outputs.every(output => output.value !== undefined || splitRemainingValue > dustThreshold(feeRate))) {
    throw new Error('InsufficientFunds');
  }

  // Finally we assign split remaining amount
  // to outputs that has no value defined
  outputs = outputs.map(({ address, value }) => ({
    address,
    value: value ?? splitRemainingValue
  }));

  return finalize(utxos, outputs, feeRate);
};
