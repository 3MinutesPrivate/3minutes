import { roundUp } from './validation.js';
import { DSR_BANDS } from './constants.js';

/**
 * Basic DSR calculation
 * DSR = totalCommitment / netIncome
 */
export function calcDSR(totalCommitment, netIncome) {
  const commit = Number(totalCommitment) || 0;
  const income = Number(netIncome) || 0;
  if (commit <= 0 || income <= 0) {
    return {
      dsr: 0,
      band: DSR_BANDS.GREEN
    };
  }
  const dsr = commit / income;
  return {
    dsr,
    band: classifyDSR(dsr)
  };
}

/**
 * Banding:
 * < 0.6 -> GREEN
 * 0.6 - 0.7 -> YELLOW
 * > 0.7 -> RED
 */
export function classifyDSR(dsrRatio) {
  if (dsrRatio < 0.6) return DSR_BANDS.GREEN;
  if (dsrRatio <= 0.7) return DSR_BANDS.YELLOW;
  return DSR_BANDS.RED;
}

/**
 * Gap for Smart Fix (Agent Traffic Light)
 * Gap = (Commitment / 0.6) - Income
 */
export function calcIncomeOrDebtGap({ totalCommitment, income }) {
  const commit = Number(totalCommitment) || 0;
  const inc = Number(income) || 0;
  if (commit <= 0 || inc <= 0) {
    return {
      extraIncomeNeeded: 0,
      debtClearanceNeeded: 0
    };
  }

  const targetIncome = commit / 0.6;
  const extraIncomeNeeded = Math.max(0, targetIncome - inc);
  // Alternatively, keep income fixed, find commitment target at 60%
  const targetCommit = inc * 0.6;
  const debtClearanceNeeded = Math.max(0, commit - targetCommit);

  return {
    extraIncomeNeeded: roundUp(extraIncomeNeeded, 2),
    debtClearanceNeeded: roundUp(debtClearanceNeeded, 2)
  };
}

/**
 * Net Disposable Income after commitments
 */
export function calcNDI(netRecognizedIncome, totalCommitment) {
  const income = Number(netRecognizedIncome) || 0;
  const commit = Number(totalCommitment) || 0;
  return roundUp(income - commit, 2);
}

/**
 * Living cost check using living cost table row
 * livingCostRow: { minNDI: number } OR direct value
 */
export function checkLivingCost(ndi, livingCostRow) {
  if (!livingCostRow) {
    return {
      passes: true,
      requiredNDI: 0
    };
  }
  const requiredNDI =
    typeof livingCostRow === 'number'
      ? livingCostRow
      : Number(livingCostRow.minNDI || livingCostRow.amount || 0) || 0;
  const passes = ndi >= requiredNDI;
  return {
    passes,
    requiredNDI: roundUp(requiredNDI, 2)
  };
}
