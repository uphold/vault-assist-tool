import { AlgorithmResult, Input, Output, SelectionResult } from './types';
import { accumulative } from './algorithms/accumulative';
import { blackjack } from './algorithms/blackjack';
import { split } from './algorithms/split';
import { utxoScore } from './utils';

const standardSelection = (utxos: Input[], outputs: Output[], feeRate: number): AlgorithmResult => {
  // Sort utxos by score;
  const sortedUtxosByScore = utxos.concat().sort(function (aUtxo, bUtxo) {
    return utxoScore(bUtxo, feeRate) - utxoScore(aUtxo, feeRate);
  });

  try {
    // attempt to use the blackjack strategy first (no change output)
    return blackjack(sortedUtxosByScore, outputs, feeRate);
  } catch {
    // else, try the accumulative strategy
    return accumulative(sortedUtxosByScore, outputs, feeRate);
  }
};

export const coinSelection = (utxos: Input[], recipients: Output[], feeRate: number): SelectionResult => {
  if (!feeRate || feeRate < 1) {
    throw new Error('InvalidFeeRate');
  }

  if (recipients?.length < 1 || recipients.some(recipient => !recipient.address)) {
    throw new Error('InvalidRecipients');
  }

  let algorithm = standardSelection;
  let isSendMax = false;
  let totalSatoshis = recipients.reduce((total, recipient) => total + (recipient.value ?? 0), 0);

  // If any output does not specify a value then we use the split algorithm.
  // This sends the entire utxos value, splitting it evenly between outputs
  // that have no specified value.
  // This is normally used to send _all_ of a wallets utxos
  if (recipients.some(recipient => !('value' in recipient))) {
    algorithm = split;
    isSendMax = true;
  }

  const { inputs, outputs, fee } = algorithm(utxos, recipients, feeRate);

  if (!inputs || !outputs) {
    throw new Error('InsufficientFunds');
  }

  // If it is SEND MAX (split), recalculate total output
  if (isSendMax) {
    totalSatoshis = outputs.reduce((total, output) => total + (output.value ?? 0), 0);
  }

  return {
    fee,
    inputs,
    outputs,
    totalSatoshis
  };
};
