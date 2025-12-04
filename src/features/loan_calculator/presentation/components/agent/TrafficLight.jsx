import React from "react";
import Card from "../../../../../components/common/Card.jsx";
import NumberInput from "../../../../../components/common/NumberInput.jsx";
import { formatPercent } from "../../../../../utils/formatters.js";

function TrafficLight({ linkedLoan }) {
  const [netIncome, setNetIncome] = React.useState(0);
  const [otherCommitments, setOtherCommitments] = React.useState(0);
  const [showFix, setShowFix] = React.useState(false);

  const newLoanInstallment = linkedLoan?.monthlyInstallment || 0;

  const totalCommitment = otherCommitments + newLoanInstallment;
  const dsr =
    netIncome > 0 ? Math.min(totalCommitment / netIncome, 5) : 0;

  let status = "GREEN";
  if (dsr >= 0.7) status = "RED";
  else if (dsr >= 0.6) status = "YELLOW";

  const gapIncome =
    netIncome > 0 ? Math.max(totalCommitment / 0.6 - netIncome, 0) : 0;
  const debtClearAmount =
    netIncome > 0 ? Math.max(totalCommitment - netIncome * 0.6, 0) : 0;

  const colorClass =
    status === "GREEN"
      ? "text-emerald-400"
      : status === "YELLOW"
      ? "text-amber-300"
      : "text-crimson-400";

  const badge =
    status === "GREEN"
      ? "🟢 Safe Zone"
      : status === "YELLOW"
      ? "🟡 Borderline"
      : "🔴 High Risk";

  return (
    <Card
      title="Traffic Light DSR Check"
      subtitle="Quick pre-screen to build confidence before submitting."
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <NumberInput
            id="tl-income"
            label="Net Monthly Income"
            prefix="RM"
            value={netIncome}
            onChange={(val) => {
              if (val === "") setNetIncome(0);
              else setNetIncome(Number(val));
            }}
          />
          <NumberInput
            id="tl-other-commitments"
            label="Existing Commitments"
            prefix="RM"
            value={otherCommitments}
            onChange={(val) => {
              if (val === "") setOtherCommitments(0);
              else setOtherCommitments(Number(val));
            }}
            helperText="Car loan, personal loan, cards, etc."
          />
          <NumberInput
            id="tl-new-loan"
            label="New Loan Installment (From Snap Quote)"
            prefix="RM"
            value={newLoanInstallment}
            onChange={() => {}}
            disabled
            helperText={
              linkedLoan
                ? "Auto-linked from Snap Quote."
                : "Generate a Snap Quote first."
            }
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Debt Service Ratio
            </div>
            <div className={`text-2xl font-semibold ${colorClass}`}>
              {isFinite(dsr) ? formatPercent(dsr * 100) : "—"}
            </div>
            <div className="text-xs text-slate-400">
              Total commitment RM {totalCommitment.toFixed(2)} vs income RM{" "}
              {netIncome.toFixed(2)}.
            </div>
          </div>
          <div className="text-xs text-slate-200">
            <div className="font-semibold">{badge}</div>
            <div className="text-slate-400">
              &lt; 60% is usually acceptable. 60–70% is borderline. &gt; 70%
              is high risk.
            </div>
          </div>
          {(status === "YELLOW" || status === "RED") && (
            <button
              type="button"
              onClick={() => setShowFix((v) => !v)}
              className="inline-flex items-center rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-700"
            >
              🔧 How to Fix?
            </button>
          )}
        </div>

        {showFix && (status === "YELLOW" || status === "RED") && (
          <div className="rounded-lg bg-slate-900/80 p-3 text-[11px] text-slate-200 border border-slate-700/80">
            <div className="font-semibold mb-1">Smart Fix Suggestions</div>
            {gapIncome > 0 && (
              <div className="mb-1">
                • Need Extra Income:{" "}
                <span className="font-semibold">
                  RM {gapIncome.toFixed(2)}
                </span>{" "}
                to bring DSR back to 60%.
              </div>
            )}
            {debtClearAmount > 0 && (
              <div className="mb-1">
                • Clear / restructure debt of about{" "}
                <span className="font-semibold">
                  RM {debtClearAmount.toFixed(2)}
                </span>{" "}
                in monthly commitments.
              </div>
            )}
            {gapIncome === 0 && debtClearAmount === 0 && (
              <div className="text-slate-400">
                Enter valid income and commitments to see suggestions.
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default TrafficLight;
