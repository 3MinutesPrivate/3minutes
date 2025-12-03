// Display helpers: currency / percent / date

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatCurrency(value) {
  const n = safeNumber(value);
  try {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    // Fallback: simple RM prefix
    return `RM ${n.toFixed(2)}`;
  }
}

/**
 * value assumed to be "percentage as number", e.g.
 * 4.1  => "4.1%"
 * 60   => "60.0%"
 */
export function formatPercent(value, decimals = 1) {
  const n = safeNumber(value);
  return `${n.toFixed(decimals)}%`;
}

export function formatDate(value, options) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  const base = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  try {
    return new Intl.DateTimeFormat("en-MY", {
      ...base,
      ...(options || {}),
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}
