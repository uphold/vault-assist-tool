import { validateMnemonic } from '../../lib/vault';

export const isValidMnemonic = mnemonic => {
  return validateMnemonic(mnemonic);
};
