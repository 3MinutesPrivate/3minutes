import { HIVE_MIND_ENDPOINT } from './constants.js';

async function safeFetch(url, options) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });
  if (!res.ok) {
    throw new Error(`HiveMind request failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch latest defaults (e.g., default_interest_rate) from Hive Mind Worker.
 */
export async function fetchDefaults() {
  try {
    const data = await safeFetch(`${HIVE_MIND_ENDPOINT}/defaults`, {
      method: 'GET'
    });
    return {
      defaultInterestRate: data.defaultInterestRate,
      defaultTenureYears: data.defaultTenureYears,
      defaultDownpaymentPct: data.defaultDownpaymentPct
    };
  } catch {
    return null;
  }
}

/**
 * Log user override on interest rate for Hive Mind aggregation.
 */
export async function logInterestOverride(interestRate) {
  try {
    await safeFetch(`${HIVE_MIND_ENDPOINT}/overrides`, {
      method: 'POST',
      body: JSON.stringify({
        interestRate: Number(interestRate),
        ts: new Date().toISOString()
      })
    });
  } catch {
    // ignore network/logging errors
  }
}
