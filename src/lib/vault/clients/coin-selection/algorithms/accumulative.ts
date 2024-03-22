import { AlgorithmResult, Input, Output } from '../types';
import { finalize, inputBytes, sumOrNaN, transactionBytes, uintOrNaN } from '../utils';

/**
 * Constructs a Bitcoin transaction using an "accumulative" strategy to accumulate inputs
 * until there are enough funds to cover the outputs and fees. This function iterates through
 * the available unspent transaction outputs (UTXOs) and accumulates inputs until the total
 * input value is sufficient. It then returns a finalized transaction. If there are insufficient
 * funds, it throws an error.
 * @param {Input[]} utxos - The unspent transaction outputs (inputs).
 * @param {Output[]} outputs - The outputs of the transaction.
 * @param {number} feeRate - The fee rate for the transaction.
 * @returns {Result} The finalized transaction.
 * @throws {Error} If the fee rate is invalid or there are insufficient funds.
 */

export const accumulative = (utxos: Input[], outputs: Output[], feeRate: number): AlgorithmResult => {
  // Initially calculating total transaction bytes
  // without inputs because we still do not know which ones
  // will be selected
  let totalBytes = transactionBytes([], outputs);

  // Total amount we want to send
  const outputsTotalValue = sumOrNaN(outputs);

  let selectedInputsTotalValue = 0;
  const selectedInputs = [];

  // Loop through utxos to find match
  for (let i = 0; i < utxos.length; ++i) {
    const inputCandidate = utxos[i];
    const inputCandidateBytes = inputBytes(inputCandidate);
    const inputCandidateFee = feeRate * inputCandidateBytes;
    const inputCandidateValue = uintOrNaN(inputCandidate.value);

    // Checking if fee of this input is higher then its value
    // meaning that this is under the threshold
    if (inputCandidateFee > inputCandidateValue) {
      // In case this is last input candidate
      // it means we haven't got enough funds
      // early throw error
      if (i === utxos.length - 1) {
        throw new Error('InsufficientFunds');
      }

      continue;
    }

    // On this point we found input that we can add
    totalBytes += inputCandidateBytes;
    selectedInputsTotalValue += inputCandidateValue;
    selectedInputs.push(inputCandidate);

    // After adding new input we calculate
    // total fee of transaction
    const totalFee = feeRate * totalBytes;

    // We now validate if value of all inputs is bigger
    // then total amount we want to send plus fee
    // in case we still need more sats, we keep searching
    // for more inputs
    if (selectedInputsTotalValue < outputsTotalValue + totalFee) {
      continue;
    }

    // If we manage to find perfect set of inputs that do
    // not create change but has enough funds to send the amount
    // we defined and also to pay a fee
    // we just finalize transaction
    return finalize(selectedInputs, outputs, feeRate);
  }

  throw new Error('InsufficientFunds');
};
