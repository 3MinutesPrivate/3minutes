// Core financial calculations for 3Minutes
// - PMT / monthly installment
// - Amortization schedule
// - Entry costs (SRO-style tiers for MOT / legal / loan stamp duty)
// - Reverse calc from monthly budget

const MONTHS_IN_YEAR = 12;

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function roundUp2(value) {
  const n = toNumber(value);
  return Math.ceil(n * 100) / 100;
}

/**
 * Standard housing loan PMT.
 * principal: loan amount (RM)
 * annualRate: % p.a. (e.g. 4.1)
 * tenureYears: total years
 */
export function calculateMonthlyInstallment(principal, annualRate, tenureYears) {
  const P = toNumber(principal);
  const yearlyRate = toNumber(annualRate) / 100;
  const years = toNumber(tenureYears);

  if (P <= 0 || years <= 0) return 0;

  const n = years * MONTHS_IN_YEAR;
  const r = yearlyRate / MONTHS_IN_YEAR;

  if (r === 0) {
    return roundUp2(P / n);
  }

  const factor = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const payment = P * factor;

  return roundUp2(payment);
}

/**
 * Build simple amortization schedule (monthly).
 * Returns rows: { monthIndex, year, month, date, payment, principal, interest, balance }
 */
export function buildAmortizationSchedule(
  principal,
  annualRate,
  tenureYears,
  startDate
) {
  const P = toNumber(principal);
  const yearlyRate = toNumber(annualRate) / 100;
  const years = toNumber(tenureYears);

  if (P <= 0 || years <= 0 || !startDate) return [];

  const n = years * MONTHS_IN_YEAR;
  const r = yearlyRate / MONTHS_IN_YEAR;
  const payment = calculateMonthlyInstallment(P, annualRate, tenureYears);

  const schedule = [];
  let balance = P;

  const d = new Date(startDate);
  if (Number.isNaN(d.getTime())) return [];

  for (let i = 1; i <= n && balance > 0; i += 1) {
    const interest = balance * r;
    let principalPaid = payment - interest;
    if (principalPaid > balance) {
      principalPaid = balance;
    }
    const actualPayment = principalPaid + interest;
    balance = balance - principalPaid;

    const rowDate = new Date(d.getTime());
    rowDate.setMonth(d.getMonth() + (i - 1));

    schedule.push({
      monthIndex: i,
      year: rowDate.getFullYear(),
      month: rowDate.getMonth() + 1,
      date: rowDate.toISOString().slice(0, 10),
      payment: roundUp2(actualPayment),
      principal: roundUp2(principalPaid),
      interest: roundUp2(interest),
      balance: balance > 0 ? roundUp2(balance) : 0,
    });
  }

  return schedule;
}

/**
 * Generic tiered calculator.
 * bands: [{ limit: number | Infinity, rate: decimal }, ...]
 * limits are cumulative upper bounds.
 */
function calcTiered(amount, bands) {
  let remaining = toNumber(amount);
  let lastLimit = 0;
  let total = 0;

  for (const band of bands) {
    if (remaining <= 0) break;
    const cap = band.limit;
    const slice =
      cap === Infinity
        ? remaining
        : Math.max(Math.min(remaining, cap - lastLimit), 0);
    if (slice > 0) {
      total += slice * band.rate;
      remaining -= slice;
    }
    lastLimit = cap;
  }

  return total;
}

/**
 * Entry cost calculator (Malaysia-style, simplified but tiered).
 * - MOT stamp duty: progressive tiers
 * - Loan stamp duty: flat 0.5% of loan
 * - Legal fees: progressive tiers (sale & purchase)
 * All results rounded up to 2 decimals.
 */
export function calculateEntryCosts(propertyPrice, loanAmount) {
  const price = toNumber(propertyPrice);
  const loan = toNumber(loanAmount);

  if (price <= 0 || loan <= 0) {
    return {
      motStampDuty: 0,
      loanStampDuty: 0,
      legalFee: 0,
      total: 0,
    };
  }

  // MOT: 1% first 100k, 2% next 400k, 3% next 500k, 4% balance
  const MOT_BANDS = [
    { limit: 100000, rate: 0.01 },
    { limit: 500000, rate: 0.02 },
    { limit: 1000000, rate: 0.03 },
    { limit: Infinity, rate: 0.04 },
  ];

  // Legal fee (simplified from SRO scale)
  const LEGAL_FEE_BANDS = [
    { limit: 500000, rate: 0.01 },
    { limit: 1000000, rate: 0.008 },
    { limit: 3000000, rate: 0.007 },
    { limit: 5000000, rate: 0.006 },
    { limit: Infinity, rate: 0.005 },
  ];

  const motStampDuty = roundUp2(calcTiered(price, MOT_BANDS));
  const loanStampDuty = roundUp2(loan * 0.005);
  const legalFee = roundUp2(calcTiered(price, LEGAL_FEE_BANDS));

  const total = roundUp2(motStampDuty + loanStampDuty + legalFee);

  return {
    motStampDuty,
    loanStampDuty,
    legalFee,
    total,
  };
}

/**
 * Reverse calculator: from monthly budget to max loan & property price.
 * params: { monthlyBudget, annualRate, tenureYears, marginPercent }
 */
export function calculateMaxPropertyPriceFromBudget({
  monthlyBudget,
  annualRate,
  tenureYears,
  marginPercent,
}) {
  const payment = toNumber(monthlyBudget);
  const yearlyRate = toNumber(annualRate) / 100;
  const years = toNumber(tenureYears);
  const margin = toNumber(marginPercent) / 100;

  if (payment <= 0 || years <= 0 || margin <= 0) {
    return {
      maxLoanAmount: 0,
      maxPropertyPrice: 0,
      impliedDsr: 0.6,
    };
  }

  const n = years * MONTHS_IN_YEAR;
  const r = yearlyRate / MONTHS_IN_YEAR;
  let principal = 0;

  if (r === 0) {
    principal = payment * n;
  } else {
    const factor = (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    principal = payment * factor;
  }

  const maxLoanAmount = roundUp2(principal);
  const maxPropertyPrice = roundUp2(maxLoanAmount / margin);

  // Implied DSR: by design, we use the 60% reference line.
  return {
    maxLoanAmount,
    maxPropertyPrice,
    impliedDsr: 0.6,
  };
}
