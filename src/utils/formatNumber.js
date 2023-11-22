// Simple number format util using browser locale
export const formatNumber = (value, maximumFractionDigits = 5, minimumFractionDigits = 2) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits, minimumFractionDigits }).format(value);
