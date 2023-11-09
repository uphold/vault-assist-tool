export const isXRPAddress = (value) => {
  return value.match(/^([r])([1-9A-HJ-NP-Za-km-z]{24,34})$/);
};
