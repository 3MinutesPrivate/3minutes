import { addMonths, daysBetween, formatDate, toDate } from './dateUtils.js';
import { roundUp } from './validation.js';
import { calcMonthlyInstallment } from './financialEngine.js';

/**
 * Flexi simulator using Daily Rest interest:
 * Interest for a period = (Outstanding - Bucket) * rate / 365 * days
 *
 * loanType: 'semi' | 'full'
 * paymentMethod: 'auto_debit' | 'regular' | 'principal'
 * advanceEvents: [{ date: 'YYYY-MM-DD', amount: number }]
 */
export function simulateFlexiLoan({
  principal,
  annualRatePct,
  tenureYears,
  startDate,
  loanType = 'semi',
  paymentMethod = 'auto_debit',
  advanceEvents = [],
  maxMonths = 120 // limit simulation horizon to avoid huge arrays
}) {
  const P = Number(principal) || 0;
  const rate = Number(annualRatePct) || 0;
  const years = Number(tenureYears) || 0;

  if (P <= 0 || rate <= 0 || years <= 0) {
    return {
      events: [],
      hlSeries: [],
      saSeries: [],
      totalInterestFlexi: 0,
      totalInterestConventional: 0,
      interestSaved: 0
    };
  }

  const baseInstallment = calcMonthlyInstallment(P, rate, years);
  const start = toDate(startDate) || new Date();

  const sortedAdvances = [...advanceEvents]
    .filter((e) => e.amount && e.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let hlBalance = P;
  let saReserve = 0; // installment reserve bucket
  let saBucket = 0; // interest-offset bucket
  let currentDate = start;

  const events = [
    {
      date: formatDate(currentDate),
      type: 'loan_start',
      label: 'Loan Start',
      details: {
        principal: roundUp(P, 2),
        annualRatePct: rate,
        tenureYears: years
      }
    }
  ];

  const hlSeries = [
    {
      date: formatDate(currentDate),
      balance: roundUp(hlBalance, 2)
    }
  ];
  const saSeries = [
    {
      date: formatDate(currentDate),
      balance: roundUp(saReserve + saBucket, 2)
    }
  ];

  let totalInterestFlexi = 0;
  let totalInterestConventional = 0;

  const getNextAdvance = (() => {
    let idx = 0;
    return () => {
      if (idx >= sortedAdvances.length) return null;
      return sortedAdvances[idx];
    };
  })();

  let nextAdvance = getNextAdvance();

  for (let month = 1; month <= years * 12 && month <= maxMonths; month++) {
    const nextDueDate = addMonths(currentDate, 1);
    if (!nextDueDate) break;

    // Process advance events within this period (before due date)
    while (nextAdvance && new Date(nextAdvance.date) <= nextDueDate) {
      const advDate = toDate(nextAdvance.date);
      const days = daysBetween(currentDate, advDate);

      // Interest for flexi period up to advance (offset by bucket)
      const effectiveOutstanding = Math.max(0, hlBalance - saBucket);
      const interestFlexi = effectiveOutstanding * (rate / 100) * (days / 365);
      const interestConventional = hlBalance * (rate / 100) * (days / 365);

      totalInterestFlexi += interestFlexi;
      totalInterestConventional += interestConventional;

      currentDate = advDate;

      // Split logic: reserve vs bucket
      let remaining = Number(nextAdvance.amount) || 0;
      let reserved = 0;
      let bucketed = 0;

      // Reserve up to 3 installments by default
      for (let i = 0; i < 3; i++) {
        if (remaining >= baseInstallment) {
          saReserve += baseInstallment;
          remaining -= baseInstallment;
          reserved += baseInstallment;
        }
      }
      if (remaining > 0) {
        saBucket += remaining;
        bucketed = remaining;
      }

      events.push({
        date: formatDate(currentDate),
        type: 'advance',
        label: 'Advance Payment',
        details: {
          amount: roundUp(nextAdvance.amount, 2),
          reservedInstallments: roundUp(reserved, 2),
          bucketAmount: roundUp(bucketed, 2)
        }
      });

      hlSeries.push({
        date: formatDate(currentDate),
        balance: roundUp(hlBalance, 2)
      });
      saSeries.push({
        date: formatDate(currentDate),
        balance: roundUp(saReserve + saBucket, 2)
      });

      // Move to next advance in queue
      sortedAdvances.shift();
      nextAdvance = getNextAdvance();
    }

    // From last event date to due date
    const daysToDue = daysBetween(currentDate, nextDueDate);
    const effectiveOutstanding = Math.max(0, hlBalance - saBucket);
    const interestFlexi = effectiveOutstanding * (rate / 100) * (daysToDue / 365);
    const interestConventional = hlBalance * (rate / 100) * (daysToDue / 365);

    totalInterestFlexi += interestFlexi;
    totalInterestConventional += interestConventional;

    currentDate = nextDueDate;

    // Deduction logic at due date
    let installmentPaidFrom = 'cashflow';
    let usedReserve = 0;
    let usedBucket = 0;

    // Priority: Reserve -> Bucket (for full flexi) -> Cash
    if (saReserve >= baseInstallment) {
      saReserve -= baseInstallment;
      usedReserve = baseInstallment;
      installmentPaidFrom = 'reserve';
    } else if (loanType === 'full' && saReserve + saBucket >= baseInstallment) {
      // top up from bucket
      const neededFromBucket = baseInstallment - saReserve;
      usedReserve = saReserve;
      saReserve = 0;
      saBucket -= neededFromBucket;
      usedBucket = neededFromBucket;
      installmentPaidFrom = 'reserve_bucket';
    }

    let principalPaid;
    if (paymentMethod === 'principal') {
      // Treat full installment as principal; interest settled separately
      principalPaid = baseInstallment;
    } else {
      principalPaid = baseInstallment - interestFlexi;
    }

    principalPaid = Math.min(hlBalance, principalPaid);
    hlBalance = Math.max(0, hlBalance - principalPaid);

    const smartLogicTriggered = installmentPaidFrom === 'reserve_bucket';

    events.push({
      date: formatDate(currentDate),
      type: 'due_date',
      label: 'Due Date',
      details: {
        installment: roundUp(baseInstallment, 2),
        interestFlexi: roundUp(interestFlexi, 2),
        principalPaid: roundUp(principalPaid, 2),
        paidFrom: installmentPaidFrom,
        usedReserve: roundUp(usedReserve, 2),
        usedBucket: roundUp(usedBucket, 2),
        smartLogicTriggered
      }
    });

    if (smartLogicTriggered) {
      events.push({
        date: formatDate(currentDate),
        type: 'smart_logic',
        label: 'Smart Logic Trigger',
        details: {
          message: 'System auto-deducted from bucket due to insufficient SA reserve.'
        }
      });
    }

    hlSeries.push({
      date: formatDate(currentDate),
      balance: roundUp(hlBalance, 2)
    });
    saSeries.push({
      date: formatDate(currentDate),
      balance: roundUp(saReserve + saBucket, 2)
    });

    if (hlBalance <= 0.01) break;
  }

  return {
    events,
    hlSeries,
    saSeries,
    totalInterestFlexi: roundUp(totalInterestFlexi, 2),
    totalInterestConventional: roundUp(totalInterestConventional, 2),
    interestSaved: roundUp(totalInterestConventional - totalInterestFlexi, 2)
  };
}
