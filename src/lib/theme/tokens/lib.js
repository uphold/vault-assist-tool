import { get } from '../utils/get';

export const isToken = (value) => typeof value === 'string' && value.startsWith('$');

export const getTokenValue = ({ tokens, value }, defaultUnit = 'px') => {
  // The value has a format like `$dimension-1`
  // We first remove the '$', then split by '-'
  // And finally, look for the path ['dimension', '1'] inside `tokens`
  const tokenValue = get(tokens, value.slice(1).split('-'));

  if (!tokenValue && __DEV__) {
    throw new Error(`Token not found: ${value}`);
  }

  // Assign a unit if is a number
  return isNaN(tokenValue) ? tokenValue : `${tokenValue}${defaultUnit}`;
};
