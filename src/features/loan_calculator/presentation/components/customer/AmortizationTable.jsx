import React from "react";
import Card from "../../../../../components/common/Card.jsx";
import Tabs from "../../../../../components/common/Tabs.jsx";
import Select from "../../../../../components/common/Select.jsx";
import { buildAmortizationSchedule } from "../../../../../utils/financialEngine.js";
import {
  formatCurrency,
  formatDate,
} from "../../../../../utils/formatters.js";

function AmortizationTable({ calcState }) {
  const { loanPrincipal, interestRate, tenureYears, startDate } =
    calcState || {};

  const [mode, setMode] = React.useState("monthly");
  const [selectedYear, setSelectedYear] = React.useState("all");

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

  const years = React.useMemo(() => {
    const ys = Array.from(new Set(schedule.map((r) => r.year)));
    return ys.sort((a, b) => a - b);
  }, [schedule]);

  React.useEffect(() => {
    if (years.length && !years.includes(Number(selectedYear))) {
      setSelectedYear("all");
    }
  }, [years, selectedYear]);

  const filteredMonthlyRows = React.useMemo(() => {
    if (selectedYear === "all") return schedule;
    const yearNum = Number(selectedYear);
    return schedule.filter((row) => row.year === yearNum);
  }, [schedule, selectedYear]);

  const annualRows = React.useMemo(() => {
    if (!schedule.length) return [];
    const result = [];
    let currentYear = null;
    let agg = null;

    schedule.forEach((row) => {
      if (row.year !== currentYear) {
        if (agg) {
          result.push(agg);
        }
        agg = {
          year: row.year,
          openingBalance: row.balance + row.principal,
          principalPaid: 0,
          interestPaid: 0,
          closingBalance: row.balance,
        };
        currentYear = row.year;
      }
      agg.principalPaid += row.principal;
      agg.interestPaid += row.interest;
      agg.closingBalance = row.balance;
    });

    if (agg) result.push(agg);
    return result;
  }, [schedule]);

  const visibleAnnualRows = React.useMemo(() => {
    if (selectedYear === "all") return annualRows;
    const yearNum = Number(selectedYear);
    return annualRows.filter((row) => row.year === yearNum);
  }, [annualRows, selectedYear]);

  const yearOptions =
    years.length > 0
      ? [
          { value: "all", label: "All Years" },
          ...years.map((y) => ({ value: String(y), label: String(y) })),
        ]
      : [];

  return (
    <Card
      title="Amortization Schedule"
      subtitle="See how your balance reduces over time."
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Tabs
          tabs={[
            { id: "monthly", label: "Monthly" },
            { id: "annual", label: "Annual" },
          ]}
          activeId={mode}
          onChange={setMode}
        />
        {yearOptions.length > 0 && (
          <Select
            id="amort-year"
            value={selectedYear}
            onChange={setSelectedYear}
            options={yearOptions}
            helperText="Filter by year"
          />
        )}
      </div>

      <div className="max-h-80 overflow-auto rounded-lg border border-slate-800/80">
        {mode === "monthly" ? (
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">#</th>
                <th className="px-3 py-2 text-left font-medium">Date</th>
                <th className="px-3 py-2 text-right font-medium">
                  Installment
                </th>
                <th className="px-3 py-2 text-right font-medium">Principal</th>
                <th className="px-3 py-2 text-right font-medium">Interest</th>
                <th className="px-3 py-2 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredMonthlyRows.map((row) => (
                <tr
                  key={row.monthIndex}
                  className="border-t border-slate-800/80 text-slate-200"
                >
                  <td className="px-3 py-1.5">{row.monthIndex}</td>
                  <td className="px-3 py-1.5">
                    {formatDate(row.date, {
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {formatCurrency(row.payment)}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {formatCurrency(row.principal)}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {formatCurrency(row.interest)}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {formatCurrency(row.balance)}
                  </td>
                </tr>
              ))}
              {!filteredMonthlyRows.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    No data. Adjust inputs above to see the schedule.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Year</th>
                <th className="px-3 py-2 text-right font-medium">
                  Opening Balance
                </th>
                <th className="px-3 py-2 text-right font-medium">
                  Principal Paid
                </th>
                <th className="px-3 py-2 text-right font-medium">
                  Interest Paid
                </th>
                <th className="px-3 py-2 text-right font-medium">
                  Closing Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleAnnualRows.map((row) => (
                <tr
                  key={row.year}
                  className="border-t border-slate-800/80 text-slate-200"
                >
                  <td className="px-3 py-1.5">{row.year}</td>
                  <td className="px-3 py-1.5 text-right">
                    {formatCurrency(row.openingBalance)}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {formatCurrency(row.principalPaid)}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {formatCurrency(row.interestPaid)}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {formatCurrency(row.closingBalance)}
                  </td>
                </tr>
              ))}
              {!visibleAnnualRows.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    No data. Adjust inputs above to see the schedule.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}

export default AmortizationTable;
