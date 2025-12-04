import React from "react";
import Card from "../../../../../components/common/Card.jsx";
import { loadHandbook } from "../../../../../utils/handbookStorage.js";
import {
  formatCurrency,
  formatPercent,
} from "../../../../../utils/formatters.js";

function SimulationMitigation({ incomeSummary, commitmentResult }) {
  const netIncome =
    commitmentResult?.netIncome || incomeSummary?.totalNetIncome || 0;
  const totalCommitment = commitmentResult?.totalCommitment || 0;
  const dsr = commitmentResult?.dsr || 0;
  const ndi = commitmentResult?.ndi || 0;
  const status = commitmentResult?.status || "GREEN";

  const handbook = React.useMemo(() => loadHandbook(), []);
  const maxTenure = handbook.global?.maxTenure ?? 35;
  const targetDsr = handbook.bankStrategies?.defaultDsrLimit ?? 0.6;

  const [currentTenure, setCurrentTenure] = React.useState(
    Math.min(30, maxTenure)
  );
  const [selectedScenario, setSelectedScenario] = React.useState(null);

  const housingDebt = React.useMemo(() => {
    const list = commitmentResult?.debts || [];
    return list.find((d) => d.id === "housing") || null;
  }, [commitmentResult]);

  const bestDebtForSettlement = React.useMemo(() => {
    const list = commitmentResult?.debts || [];
    let best = null;
    let bestScore = 0;

    list.forEach((d) => {
      if (!d.installment || !d.balance || d.balance <= 0) return;
      if (d.id === "housing") return; // avoid suggesting settling subject property

      const score = d.installment / d.balance;
      if (score > bestScore) {
        bestScore = score;
        best = d;
      }
    });

    return best;
  }, [commitmentResult]);

  const incomeDeficit =
    totalCommitment > 0
      ? Math.max(totalCommitment / targetDsr - netIncome, 0)
      : 0;

  const softFixAvailable =
    housingDebt && currentTenure < maxTenure && housingDebt.installment > 0;

  const simulateSoftFix = () => {
    if (!softFixAvailable) return null;
    const ratio = currentTenure / maxTenure;
    const newHousingInst = housingDebt.installment * ratio;
    const newTotal =
      totalCommitment - housingDebt.installment + newHousingInst;
    const newDsr = netIncome > 0 ? newTotal / netIncome : 0;
    const newNdi = netIncome - newTotal;
    return { newTotal, newDsr, newNdi };
  };

  const simulateDebtSettlement = () => {
    if (!bestDebtForSettlement) return null;
    const newTotal = totalCommitment - bestDebtForSettlement.installment;
    const newDsr = netIncome > 0 ? newTotal / netIncome : 0;
    const newNdi = netIncome - newTotal;
    return { newTotal, newDsr, newNdi };
  };

  const shouldShow =
    status === "YELLOW" || status === "RED" || status === "FAIL_COST";

  if (!shouldShow) {
    return null;
  }

  const softFixSim = simulateSoftFix();
  const debtFixSim = simulateDebtSettlement();

  const selectedSim =
    selectedScenario === "soft"
      ? softFixSim
      : selectedScenario === "debt"
      ? debtFixSim
      : null;

  return (
    <Card
      title="Simulation & Mitigation"
      subtitle="Rescue-engine for borderline or failing cases. Explore tenure, debt and income fixes."
      highlight
    >
      <div className="space-y-4 text-xs text-slate-200">
        <div className="grid gap-3 md:grid-cols-3 border-b border-slate-800/80 pb-3">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Current DSR
            </div>
            <div className="text-lg font-semibold text-crimson-400">
              {formatPercent(dsr * 100)}
            </div>
            <div className="text-[11px] text-slate-400">
              Commitments {formatCurrency(totalCommitment)} vs net income{" "}
              {formatCurrency(netIncome)}.
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Current NDI
            </div>
            <div className="text-lg font-semibold text-slate-50">
              {formatCurrency(ndi)}
            </div>
            <div className="text-[11px] text-slate-400">
              Before applying any mitigation strategies.
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Income Deficit @ {formatPercent(targetDsr * 100)}
            </div>
            <div className="text-lg font-semibold text-amber-300">
              {formatCurrency(incomeDeficit)}
            </div>
            <div className="text-[11px] text-slate-400">
              Extra net income required to bring DSR to{" "}
              {formatPercent(targetDsr * 100)}.
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Soft Fix */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/80 p-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-200">
                1. Soft Fix – Tenure Extension
              </div>
              {housingDebt ? (
                <>
                  <div className="text-[11px] text-slate-400">
                    Subject property instalment:{" "}
                    <span className="font-semibold">
                      {formatCurrency(housingDebt.installment)}
                    </span>
                    .
                  </div>
                  <div className="mt-1">
                    <label
                      htmlFor="sim-tenure"
                      className="mb-1 block text-[11px] font-medium text-slate-300"
                    >
                      Current Tenure (years)
                    </label>
                    <input
                      id="sim-tenure"
                      type="number"
                      min={1}
                      max={maxTenure}
                      value={currentTenure}
                      onChange={(e) =>
                        setCurrentTenure(
                          Math.max(
                            1,
                            Math.min(maxTenure, Number(e.target.value) || 0)
                          )
                        )
                      }
                      className="w-full rounded border border-slate-700/80 bg-slate-950 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-500/60"
                    />
                    <p className="mt-1 text-[10px] text-slate-500">
                      Max tenure from handbook: {maxTenure} years.
                    </p>
                  </div>
                  {softFixAvailable && softFixSim && (
                    <div className="mt-2 text-[11px] text-slate-300">
                      <div>
                        Est. new instalment{" "}
                        <span className="font-semibold text-emerald-300">
                          {formatCurrency(
                            housingDebt.installment *
                              (currentTenure / maxTenure)
                          )}
                        </span>
                        .
                      </div>
                      <div>
                        New DSR ~{" "}
                        <span className="font-semibold text-emerald-300">
                          {formatPercent(softFixSim.newDsr * 100)}
                        </span>
                        , NDI {formatCurrency(softFixSim.newNdi)}.
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Enter subject housing instalment in Commitment Stack to
                  simulate a tenure extension.
                </p>
              )}
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setSelectedScenario("soft")}
                disabled={!softFixAvailable || !softFixSim}
                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[11px] font-semibold ${
                  selectedScenario === "soft"
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-800 text-slate-100 hover:bg-slate-700"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Apply Simulation
              </button>
            </div>
          </div>

          {/* Debt Fix */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/80 p-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-200">
                2. Debt Fix – Settle High-Ratio Debt
              </div>
              {bestDebtForSettlement && debtFixSim ? (
                <>
                  <div className="text-[11px] text-slate-400">
                    Highest stress:{" "}
                    <span className="font-semibold">
                      {bestDebtForSettlement.label}
                    </span>{" "}
                    (RM {formatCurrency(
                      bestDebtForSettlement.installment
                    )}{" "}
                    /m vs outstanding{" "}
                    {formatCurrency(bestDebtForSettlement.balance)}).
                  </div>
                  <div className="mt-2 text-[11px] text-slate-300">
                    Clearing / restructuring this could free{" "}
                    <span className="font-semibold text-emerald-300">
                      {formatCurrency(bestDebtForSettlement.installment)}
                    </span>{" "}
                    per month.
                  </div>
                  <div className="mt-1 text-[11px] text-slate-300">
                    New DSR ~{" "}
                    <span className="font-semibold text-emerald-300">
                      {formatPercent(debtFixSim.newDsr * 100)}
                    </span>
                    , NDI {formatCurrency(debtFixSim.newNdi)}.
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Enter instalment and outstanding for at least one non-housing
                  debt to get a ranked suggestion.
                </p>
              )}
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setSelectedScenario("debt")}
                disabled={!bestDebtForSettlement || !debtFixSim}
                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[11px] font-semibold ${
                  selectedScenario === "debt"
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-800 text-slate-100 hover:bg-slate-700"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Apply Simulation
              </button>
            </div>
          </div>

          {/* Structural Fix */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/80 p-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-200">
                3. Structural Fix – Joint Applicant
              </div>
              {incomeDeficit > 0 ? (
                <>
                  <div className="text-[11px] text-slate-400">
                    To hit DSR {formatPercent(targetDsr * 100)}, you need
                    additional net income of{" "}
                    <span className="font-semibold text-emerald-300">
                      {formatCurrency(incomeDeficit)}
                    </span>
                    .
                  </div>
                  <div className="mt-1 text-[11px] text-slate-300">
                    Suggest joint applicant with stable net income of at least{" "}
                    <span className="font-semibold text-emerald-300">
                      {formatCurrency(incomeDeficit)}
                    </span>{" "}
                    (after their own commitments).
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Current income is already adequate for target DSR. This case
                  may be solvable with tenure / debt fixes alone.
                </p>
              )}
            </div>
            <div className="mt-3">
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:bg-slate-700"
              >
                Mark as Joint-applicant Scenario
              </button>
            </div>
          </div>
        </div>

        {selectedSim && (
          <div className="mt-2 rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3 text-[11px] text-slate-200">
            <div className="font-semibold text-emerald-300 mb-1">
              Selected Simulation – Indicative Outcome
            </div>
            <div>
              New total commitment:{" "}
              <span className="font-semibold">
                {formatCurrency(selectedSim.newTotal)}
              </span>
              .
            </div>
            <div>
              New DSR:{" "}
              <span className="font-semibold">
                {formatPercent(selectedSim.newDsr * 100)}
              </span>{" "}
              | New NDI:{" "}
              <span className="font-semibold">
                {formatCurrency(selectedSim.newNdi)}
              </span>
              .
            </div>
            <div className="mt-1 text-slate-400">
              This is an internal planning tool only. Final approval and
              structure remain at the bank&apos;s discretion.
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default SimulationMitigation;
