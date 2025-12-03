// Flexi loan simulator (daily-rest style approximation)
//
// simulateFlexiLoan(options)
// -> { points, events, summary }
//
// points: [{ label, hlBalance, saBalance, bucketBalance }]
// events: [{ id, date, title, description, hlBalance, saBalance, bucketBalance }]
// summary: { totalInterestBaseline, totalInterestFlexi, interestSavings,
//            earlierPayoffDate, earlierByMonths }

import {
  buildAmortizationSchedule,
  calculateMonthlyInstallment,
} from "./financialEngine.js";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function round2(value) {
  const n = toNumber(value);
  return Math.round(n * 100) / 100;
}

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

function daysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

export function simulateFlexiLoan(options) {
  const principal = toNumber(options.principal);
  const annualRate = toNumber(options.annualRate);
  const tenureYears = toNumber(options.tenureYears);
  const baseInstallment =
    toNumber(options.baseInstallment) ||
    calculateMonthlyInstallment(principal, annualRate, tenureYears);
  const startDateStr = options.startDate;
  const loanType = options.loanType || "semi-flexi";
  const paymentMethod = options.paymentMethod || "auto-debit";
  const advanceAmount = toNumber(options.advanceAmount);
  const advanceDateStr = options.advanceDate || startDateStr;

  if (!startDateStr || principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
    return {
      points: [],
      events: [],
      summary: {
        totalInterestBaseline: 0,
        totalInterestFlexi: 0,
        interestSavings: 0,
        earlierPayoffDate: null,
        earlierByMonths: 0,
      },
    };
  }

  const rYear = annualRate / 100;
  const startDate = new Date(startDateStr);
  const advanceDate = new Date(advanceDateStr);

  // Baseline schedule (non-flexi)
  const baselineSchedule = buildAmortizationSchedule(
    principal,
    annualRate,
    tenureYears,
    startDateStr
  );
  const totalInterestBaseline = baselineSchedule.reduce(
    (sum, row) => sum + row.interest,
    0
  );
  const baselineMonths = baselineSchedule.length;
  const baselinePayoffDate =
    baselineSchedule[baselineSchedule.length - 1]?.date || startDateStr;

  // Flexi simulation state
  let hlBalance = principal;
  let saBalance = 0;
  let bucketBalance = 0;
  let totalInterestFlexi = 0;
  let payoffDateFlexi = null;
  let flexiMonths = 0;
  let advanceDone = false;

  const points = [];
  const events = [];

  function pushEvent(kind, dateObj, title, description, extra = {}) {
    events.push({
      id: `${kind}-${Date.now()}-${events.length}`,
      date: toISODate(dateObj),
      title,
      description,
      hlBalance: round2(extra.hlBalance ?? hlBalance),
      saBalance: round2(extra.saBalance ?? saBalance),
      bucketBalance: round2(extra.bucketBalance ?? bucketBalance),
    });
  }

  // Event: Loan start
  pushEvent(
    "start",
    startDate,
    "Loan Start",
    `Principal RM ${round2(principal)} at ${annualRate.toFixed(2)}% p.a.`,
    { hlBalance: principal, saBalance: 0, bucketBalance: 0 }
  );

  const maxMonths = Math.min(tenureYears * 12, 360); // cap at 30 years for safety
  const loopDate = new Date(startDate.getTime());

  for (let monthIndex = 1; monthIndex <= maxMonths && hlBalance > 0; monthIndex += 1) {
    // Apply advance on first month on/after advanceDate
    if (!advanceDone && loopDate >= advanceDate && advanceAmount > 0) {
      saBalance += advanceAmount;

      const bucketPortion =
        loanType === "semi-flexi" ? advanceAmount * 0.8 : advanceAmount;
      bucketBalance += bucketPortion;

      pushEvent(
        "advance",
        loopDate,
        "Advance Payment",
        `Customer placed RM ${round2(
          advanceAmount
        )} into flexi account (bucket reserve RM ${round2(
          bucketPortion
        )}).`,
        { hlBalance, saBalance, bucketBalance }
      );

      advanceDone = true;
    }

    const dim = daysInMonth(loopDate);
    const effectiveBalance = Math.max(hlBalance - bucketBalance, 0);
    const interest =
      effectiveBalance * rYear * (dim / 365); // daily-rest approximation
    let installment = baseInstallment;

    // Final month safety
    if (hlBalance + interest < installment) {
      installment = hlBalance + interest;
    }

    let principalPaid = installment - interest;
    if (principalPaid < 0) principalPaid = 0;
    if (principalPaid > hlBalance) principalPaid = hlBalance;

    // Deduct payment from SA / bucket depending on method
    let remainingInstallment = installment;
    let usedBucket = 0;

    if (paymentMethod !== "principal-repayment") {
      if (saBalance > 0 && remainingInstallment > 0) {
        const fromSa = Math.min(saBalance, remainingInstallment);
        saBalance -= fromSa;
        remainingInstallment -= fromSa;
      }

      if (bucketBalance > 0 && remainingInstallment > 0) {
        const fromBucket = Math.min(bucketBalance, remainingInstallment);
        bucketBalance -= fromBucket;
        remainingInstallment -= fromBucket;
        usedBucket = fromBucket;
      }
      // Any remainingInstallment is assumed to be paid from fresh cash.
    }

    hlBalance -= principalPaid;
    totalInterestFlexi += interest;
    flexiMonths = monthIndex;

    // Point for chart
    points.push({
      label: `M${monthIndex}`,
      hlBalance: round2(hlBalance),
      saBalance: round2(saBalance),
      bucketBalance: round2(bucketBalance),
    });

    // Event: due date
    pushEvent(
      "due",
      loopDate,
      "Due Date",
      `Installment RM ${round2(
        installment
      )}. Interest this month RM ${round2(
        interest
      )}. Principal reduced by RM ${round2(principalPaid)}.`,
      { hlBalance, saBalance, bucketBalance }
    );

    // Event: smart logic if bucket used
    if (usedBucket > 0) {
      pushEvent(
        "smart",
        loopDate,
        "Smart Logic Trigger",
        `Bucket auto-used RM ${round2(
          usedBucket
        )} to keep instalment current when SA was insufficient.`,
        { hlBalance, saBalance, bucketBalance }
      );
    }

    if (hlBalance <= 0 && !payoffDateFlexi) {
      payoffDateFlexi = toISODate(loopDate);
      break;
    }

    loopDate.setMonth(loopDate.getMonth() + 1);
  }

  const interestSavings = Math.max(
    round2(totalInterestBaseline) - round2(totalInterestFlexi),
    0
  );

  let earlierPayoffDate = null;
  let earlierByMonths = 0;

  if (payoffDateFlexi && flexiMonths < baselineMonths) {
    earlierPayoffDate = payoffDateFlexi;
    earlierByMonths = baselineMonths - flexiMonths;
  }

  return {
    points,
    events,
    summary: {
      totalInterestBaseline: round2(totalInterestBaseline),
      totalInterestFlexi: round2(totalInterestFlexi),
      interestSavings: round2(interestSavings),
      earlierPayoffDate,
      earlierByMonths,
    },
  };
}
