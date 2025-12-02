import { addMonths, formatDate } from './dateUtils.js';
import { roundUp } from './validation.js';

/**
 * Monthly installment using standard PMT formula.
 * Rounds up to 2 decimals as per requirement.
 */
export function calcMonthlyInstallment(principal, annualRatePct, tenureYears) {
  const P = Number(principal) || 0;
  const rAnnual = Number(annualRatePct) || 0;
  const nYears = Number(tenureYears) || 0;

  if (P <= 0 || rAnnual <= 0 || nYears <= 0) return 0;

  const r = rAnnual / 100 / 12; // monthly rate
  const n = nYears * 12; // months

  const payment = (P * r) / (1 - Math.pow(1 + r, -n));
  return roundUp(payment, 2);
}

/**
 * Build detailed amortization schedule (monthly + annual summary)
 */
export function buildAmortizationSchedule({ principal, annualRatePct, tenureYears, startDate }) {
  const P = Number(principal) || 0;
  const rAnnual = Number(annualRatePct) || 0;
  const nYears = Number(tenureYears) || 0;
  if (P <= 0 || rAnnual <= 0 || nYears <= 0) {
    return {
      monthly: [],
      annual: [],
      totals: { totalPayment: 0, totalInterest: 0, payoffDate: null }
    };
  }

  const monthlyRate = rAnnual / 100 / 12;
  const n = nYears * 12;
  const installment = calcMonthlyInstallment(P, rAnnual, nYears);

  let balance = P;
  let totalInterest = 0;
  let totalPayment = 0;

  const monthly = [];
  const annualMap = new Map();

  let currentDate = startDate ? new Date(startDate) : new Date();

  for (let i = 1; i <= n; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(balance, installment - interest);
    const closingBalance = Math.max(0, balance - principalPaid);

    totalInterest += interest;
    totalPayment += interest + principalPaid;

    const rowDate = i === 1 && startDate ? currentDate : addMonths(currentDate, 1);
    currentDate = rowDate;

    const row = {
      period: i,
      date: formatDate(rowDate),
      openingBalance: roundUp(balance, 2),
      payment: roundUp(installment, 2),
      principalComponent: roundUp(principalPaid, 2),
      interestComponent: roundUp(interest, 2),
      closingBalance: roundUp(closingBalance, 2)
    };
    monthly.push(row);

    const year = new Date(rowDate).getFullYear();
    if (!annualMap.has(year)) {
      annualMap.set(year, {
        year,
        openingBalance: row.openingBalance,
        payment: 0,
        principalComponent: 0,
        interestComponent: 0,
        closingBalance: row.closingBalance
      });
    }
    const a = annualMap.get(year);
    a.payment += row.payment;
    a.principalComponent += row.principalComponent;
    a.interestComponent += row.interestComponent;
    a.closingBalance = row.closingBalance;

    balance = closingBalance;
    if (balance <= 0.01) break;
  }

  const annual = Array.from(annualMap.values()).map((a) => ({
    ...a,
    payment: roundUp(a.payment, 2),
    principalComponent: roundUp(a.principalComponent, 2),
    interestComponent: roundUp(a.interestComponent, 2),
    openingBalance: roundUp(a.openingBalance, 2),
    closingBalance: roundUp(a.closingBalance, 2)
  }));

  return {
    monthly,
    annual,
    totals: {
      totalPayment: roundUp(totalPayment, 2),
      totalInterest: roundUp(totalInterest, 2),
      payoffDate: monthly.length ? monthly[monthly.length - 1].date : null
    }
  };
}

/**
 * Legal fee calculation – SRO 2023 tiered scale (conveyancing)
 * Typical structure (subject to jurisdictional verification):
 * - First 500k : 1.0%
 * - Next 500k  : 0.8%
 * - Next 2m    : 0.7%
 * - Next 2m    : 0.6%
 * - Remainder  : 0.5%
 * Minimum fee RM500.
 */
export function calcLegalFee(propertyValue) {
  const v = Number(propertyValue) || 0;
  if (v <= 0) return 0;

  const tiers = [
    { cap: 500000, rate: 0.01 },
    { cap: 1000000, rate: 0.008 },
    { cap: 3000000, rate: 0.007 },
    { cap: 5000000, rate: 0.006 },
    { cap: Infinity, rate: 0.005 }
  ];

  let remaining = v;
  let lastCap = 0;
  let fee = 0;

  for (const tier of tiers) {
    if (remaining <= 0) break;
    const slice = Math.min(remaining, tier.cap - lastCap);
    if (slice > 0) {
      fee += slice * tier.rate;
      remaining -= slice;
      lastCap = tier.cap;
    }
  }

  const minFee = 500;
  return Math.max(roundUp(fee, 2), minFee);
}

/**
 * MOT (Memorandum of Transfer) stamp duty – tiered:
 * - 1%   : first 100k
 * - 2%   : next 400k (100,001 – 500,000)
 * - 3%   : next 500k (500,001 – 1,000,000)
 * - 4%   : remainder
 */
export function calcMOTStampDuty(propertyValue) {
  const v = Number(propertyValue) || 0;
  if (v <= 0) return 0;

  const tiers = [
    { cap: 100000, rate: 0.01 },
    { cap: 500000, rate: 0.02 },
    { cap: 1000000, rate: 0.03 },
    { cap: Infinity, rate: 0.04 }
  ];

  let remaining = v;
  let lastCap = 0;
  let duty = 0;

  for (const tier of tiers) {
    if (remaining <= 0) break;
    const slice = Math.min(remaining, tier.cap - lastCap);
    if (slice > 0) {
      duty += slice * tier.rate;
      remaining -= slice;
      lastCap = tier.cap;
    }
  }

  return roundUp(duty, 2);
}

/**
 * Loan stamp duty – typically flat 0.5% of loan amount.
 */
export function calcLoanStampDuty(loanAmount) {
  const v = Number(loanAmount) || 0;
  if (v <= 0) return 0;
  const duty = v * 0.005;
  return roundUp(duty, 2);
}

/**
 * Entry cost breakdown (Legal Fee + MOT + Loan Stamp Duty)
 */
export function calcEntryCosts({ propertyValue, loanAmount }) {
  const legalFee = calcLegalFee(propertyValue);
  const motStampDuty = calcMOTStampDuty(propertyValue);
  const loanStampDuty = calcLoanStampDuty(loanAmount);
  const total = roundUp(legalFee + motStampDuty + loanStampDuty, 2);

  return {
    legalFee,
    motStampDuty,
    loanStampDuty,
    total
  };
}

/**
 * Helper for Net Price & Cash Back for Snap Quote
 * marginPct: e.g. 90 for 90% margin
 * rebatePct: e.g. 10 for 10% rebate
 */
export function calcNetPriceAndCashBack(price, marginPct, rebatePct) {
  const p = Number(price) || 0;
  const m = Number(marginPct) || 0;
  const r = Number(rebatePct) || 0;

  if (p <= 0 || m <= 0) {
    return {
      netPrice: 0,
      loanAmount: 0,
      cashBack: 0
    };
  }

  const loanAmount = p * (m / 100);
  const netPrice = p * (1 - r / 100);
  const cashBack = Math.max(0, loanAmount - netPrice);

  return {
    netPrice: roundUp(netPrice, 2),
    loanAmount: roundUp(loanAmount, 2),
    cashBack: roundUp(cashBack, 2)
  };
}
