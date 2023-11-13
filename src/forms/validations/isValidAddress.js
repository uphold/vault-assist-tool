import { validateAddress } from '../../lib/vault';

export const isValidAddress = (selectedNetwork, address) => {
  return validateAddress(selectedNetwork, address);
};
