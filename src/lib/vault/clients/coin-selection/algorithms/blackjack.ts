import { AlgorithmResult, Input, Output } from '../types';
import { dustThreshold, finalize, inputBytes, sumOrNaN, transactionBytes, uintOrNaN } from '../utils';

/**
 * Constructs a Bitcoin transaction using a "blackjack" strategy to minimize the number of inputs
 * while ensuring there are sufficient funds to cover the outputs and fees. This function iterates
 * through the available unspent transaction outputs (UTXOs) and selects the smallest combination
 * of inputs that can cover the transaction's outputs and fees without generating change. If successful,
 * it returns a finalized transaction. If there are insufficient funds, it throws an error.
 * @param {Input[]} utxos - The unspent transaction outputs (inputs).
 * @param {Output[]} outputs - The outputs of the transaction.
 * @param {number} feeRate - The fee rate for the transaction.
 * @returns {Result} The finalized transaction.
 * @throws {Error} If the fee rate is invalid or there are insufficient funds.
 */

export const blackjack = (utxos: Input[], outputs: Output[], feeRate: number): AlgorithmResult => {
  // Initially calculating total transaction bytes
  // without inputs because we still do not know which ones
  // will be selected
  let totalBytes = transactionBytes([], outputs);

  // Total amount we want to send
  const outputsTotalValue = sumOrNaN(outputs);

  // Threshold for current feeRate
  // means that inputs/output change amount less then it
  // will only make us lose money
  const threshold = dustThreshold(feeRate);

  let selectedInputsTotalValue = 0;
  const selectedInputs = [];

  // Loop through utxos to find match
  for (let i = 0; i < utxos.length; ++i) {
    const inputCandidate = utxos[i];
    const inputCandidateBytesCalculated = inputBytes(inputCandidate);
    const totalFeeWithIncludedInputCandidate = feeRate * (totalBytes + inputCandidateBytesCalculated);
    const inputCandidateValue = uintOrNaN(inputCandidate.value);

    // Checking if adding this UTXO will create "change"
    // and in that case we will skip it
    // because blackjack is trying to find inputs without change
    // This is calculated in a way that we sum all selected inputs values
    // and current one that we are checking and we validate that sum is not bigger
    // then sum of total amount we want to send plus fee and threshold
    //
    // NOTE: This means that if total amount sending is even bigger then total amount we want to send
    // plus fee but still that difference is less then threshold - there will be no change address
    // because that change will only waste value - it will increase fee that we have to pay more
    // then the change to receive actually is
    if (
      selectedInputsTotalValue + inputCandidateValue >
      outputsTotalValue + totalFeeWithIncludedInputCandidate + threshold
    ) {
      continue;
    }

    // On this point we found input that we can add
    // since adding it won't create change
    totalBytes += inputCandidateBytesCalculated;
    selectedInputsTotalValue += inputCandidateValue;
    selectedInputs.push(inputCandidate);

    // We now validate if value of all inputs is bigger
    // then total amount we want to send plus fee
    // in case we still need more sats, we keep searching
    // for more inputs
    if (selectedInputsTotalValue < outputsTotalValue + totalFeeWithIncludedInputCandidate) {
      continue;
    }

    // If we manage to find perfect set of inputs that do
    // not create change but has enough funds to send the amount
    // we defined and also to pay a fee
    // we just finalize transaction
    return finalize(selectedInputs, outputs, feeRate);
  }

  throw new Error('AlgorithmFailed');
};
