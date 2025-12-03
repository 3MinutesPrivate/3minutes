import React from "react";
import Card from "../common/Card";
import { buildAmortizationSchedule } from "../../utils/financialEngine";
import { formatCurrency, formatPercent, formatDate } from "../../utils/formatters";

function SummaryCards({ calcState }) {
  if (!calcState) return null;

  const {
    loanPrincipal,
    interestRate,
    tenureYears,
    startDate,
    installment,
    propertyValue,
  } = calcState;

  const schedule = React.useMemo(() => {
    if (!loanPrincipal || !interestRate || !tenureYears || !startDate) {
      return [];
    }
    return buildAmortizationSchedule(
      loanPrincipal,
      interestRate,
      tenureYears,
      startDate
    );
  }, [loanPrincipal, interestRate, tenureYears, startDate]);

  const totals = React.useMemo(() => {
    if (!schedule.length) {
      return {
        totalPayment: 0,
        totalInterest: 0,
        payoffDate: startDate,
      };
    }
    const totalPayment = schedule.reduce(
      (sum, row) => sum + row.payment,
      0
    );
    const totalInterest = totalPayment - loanPrincipal;
    const payoffDate = schedule[schedule.length - 1].date;
    return { totalPayment, totalInterest, payoffDate };
  }, [schedule, loanPrincipal, startDate]);

  const ltv =
    propertyValue && loanPrincipal
      ? loanPrincipal / propertyValue
      : 0;

  return (
    <Card
      title="Loan Summary"
      subtitle="Big picture view of your home financing."
      highlight
    >
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Monthly Installment
          </div>
          <div className="text-2xl font-semibold text-emerald-400">
            {formatCurrency(installment)}
          </div>
          <div className="text-xs text-slate-400">
            Fixed for the entire tenure (subject to rate changes).
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Total Payment
          </div>
          <div className="text-xl font-semibold text-slate-50">
            {formatCurrency(totals.totalPayment)}
          </div>
          <div className="text-xs text-slate-400">
            Principal {formatCurrency(loanPrincipal)} + Interest{" "}
            {formatCurrency(totals.totalInterest)}.
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Total Interest
          </div>
          <div className="text-xl font-semibold text-crimson-400">
            {formatCurrency(totals.totalInterest)}
          </div>
          <div className="text-xs text-slate-400">
            Effective rate {formatPercent(interestRate)} p.a.
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Payoff & LTV
          </div>
          <div className="text-xl font-semibold text-slate-50">
            {formatDate(totals.payoffDate)}
          </div>
          <div className="text-xs text-slate-400">
            LTV ~ {formatPercent(ltv * 100)} vs property value.
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SummaryCards;
