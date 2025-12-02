// Simple date utilities without external deps

export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  // assume YYYY-MM-DD
  const [y, m, d] = String(value).split('-').map((v) => parseInt(v, 10));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function formatDate(date) {
  const d = toDate(date);
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addMonths(date, months) {
  const d = toDate(date);
  if (!d) return null;
  const newDate = new Date(d.getTime());
  const targetMonth = newDate.getMonth() + months;
  newDate.setMonth(targetMonth);
  // handle month overflow (e.g. 31st -> 30th)
  if (newDate.getDate() !== d.getDate()) {
    newDate.setDate(0);
  }
  return newDate;
}

export function addDays(date, days) {
  const d = toDate(date);
  if (!d) return null;
  const newDate = new Date(d.getTime());
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export function daysBetween(start, end) {
  const s = toDate(start);
  const e = toDate(end);
  if (!s || !e) return 0;
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.round((e - s) / msPerDay));
}
