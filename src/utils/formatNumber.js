// Simple number format util using browser locale
export const formatNumber = (value, maximumFractionDigits = 5) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value);
