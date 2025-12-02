export function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  const n = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

export function clamp(value, min, max) {
  const n = toNumber(value, min);
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

export function isPositive(value) {
  const n = toNumber(value, NaN);
  return Number.isFinite(n) && n > 0;
}

export function isNonNegative(value) {
  const n = toNumber(value, NaN);
  return Number.isFinite(n) && n >= 0;
}

export function roundUp(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
}
