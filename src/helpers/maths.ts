export const getPercentage = (amount: number, total: number, decimals: number = 1) =>
  parseFloat((total ? (amount / total) * 100 : 0).toFixed(decimals)); // NoSonar this calculates a percentage

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
