// DSR / NDI / Cost-of-living logic

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * params: { totalCommitment, netIncome, livingCost }
 * returns: { dsr, ndi, passesCostCheck, verdict }
 *
 * Verdict:
 * - "FAIL_COST" if NDI < living cost baseline
 * - else "RED" if DSR >= 70%
 * - else "YELLOW" if 60% <= DSR < 70%
 * - else "GREEN"
 */
export function computeDsrSummary({ totalCommitment, netIncome, livingCost }) {
  const commit = toNumber(totalCommitment);
  const income = toNumber(netIncome);
  const cost = toNumber(livingCost);

  const dsr = income > 0 ? commit / income : 0;
  const ndi = income - commit;

  let verdict = "GREEN";
  let passesCostCheck = true;

  if (ndi < cost) {
    verdict = "FAIL_COST";
    passesCostCheck = false;
  } else if (dsr >= 0.7) {
    verdict = "RED";
  } else if (dsr >= 0.6) {
    verdict = "YELLOW";
  }

  return {
    dsr,
    ndi,
    passesCostCheck,
    verdict,
  };
}
