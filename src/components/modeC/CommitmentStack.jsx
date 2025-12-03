import React from "react";
import Card from "../common/Card";
import NumberInput from "../common/NumberInput";
import Select from "../common/Select";
import livingCostTable from "../../data/livingCostTable.json";
import { computeDsrSummary } from "../../utils/dsrEngine";
import { formatCurrency, formatPercent } from "../../utils/formatters";

function CommitmentStack({ incomeSummary, onResultChange }) {
  const netIncome = incomeSummary?.totalNetIncome || 0;

  const [debts, setDebts] = React.useState({
    housingInst: 0,
    housingBal: 0,
    carInst: 0,
    carBal: 0,
    personalInst: 0,
    personalBal: 0,
    ptptnInst: 0,
    ptptnBal: 0,
    ccOutstanding: 0,
    ccRateType: "5", // "5" or "1"
    coopInst: 0,
    coopBal: 0,
    pawnInst: 0,
    pawnBal: 0,
    alimonyInst: 0,
  });

  const [showHidden, setShowHidden] = React.useState(false);
  const [livingProfileId, setLivingProfileId] = React.useState(
    livingCostTable[0]?.id || ""
  );

  const livingProfile = React.useMemo(
    () => livingCostTable.find((p) => p.id === livingProfileId),
    [livingProfileId]
  );

  const ccCommitment = React.useMemo(() => {
    const outstanding = Number(debts.ccOutstanding) || 0;
    const rate = debts.ccRateType === "1" ? 0.01 : 0.05;
    return outstanding * rate;
  }, [debts.ccOutstanding, debts.ccRateType]);

  const bankDebts = React.useMemo(
    () => [
      {
        id: "housing",
        label: "Housing Loan",
        installment: Number(debts.housingInst) || 0,
        balance: Number(debts.housingBal) || 0,
        hidden: false,
      },
      {
        id: "car",
        label: "Car Loan",
        installment: Number(debts.carInst) || 0,
        balance: Number(debts.carBal) || 0,
        hidden: false,
      },
      {
        id: "personal",
        label: "Personal Loan",
        installment: Number(debts.personalInst) || 0,
        balance: Number(debts.personalBal) || 0,
        hidden: false,
      },
      {
        id: "creditCard",
        label: "Credit Card",
        installment: ccCommitment,
        balance: Number(debts.ccOutstanding) || 0,
        hidden: false,
      },
      {
        id: "ptptn",
        label: "PTPTN / Study Loan",
        installment: Number(debts.ptptnInst) || 0,
        balance: Number(debts.ptptnBal) || 0,
        hidden: false,
      },
      {
        id: "coop",
        label: "Co-op Loan",
        installment: Number(debts.coopInst) || 0,
        balance: Number(debts.coopBal) || 0,
        hidden: true,
      },
      {
        id: "pawn",
        label: "Pawn / Micro Loan",
        installment: Number(debts.pawnInst) || 0,
        balance: Number(debts.pawnBal) || 0,
        hidden: true,
      },
      {
        id: "alimony",
        label: "Alimony / Obligations",
        installment: Number(debts.alimonyInst) || 0,
        balance: 0,
        hidden: true,
      },
    ],
    [debts, ccCommitment]
  );

  const {
    totalCommitment,
    bankCommitment,
    hiddenCommitment,
    summary,
  } = React.useMemo(() => {
    const bankCommit = bankDebts
      .filter((d) => !d.hidden)
      .reduce((sum, d) => sum + d.installment, 0);
    const hiddenCommit = bankDebts
      .filter((d) => d.hidden)
      .reduce((sum, d) => sum + d.installment, 0);
    const total = bankCommit + hiddenCommit;
    const livingCostBaseline = livingProfile?.baseline || 0;

    const dsrSummary = computeDsrSummary({
      totalCommitment: total,
      netIncome,
      livingCost: livingCostBaseline,
    });

    return {
      bankCommitment: bankCommit,
      hiddenCommitment: hiddenCommit,
      totalCommitment: total,
      summary: {
        ...dsrSummary,
        livingCostBaseline,
      },
    };
  }, [bankDebts, netIncome, livingProfile]);

  React.useEffect(() => {
    if (typeof onResultChange === "function") {
      onResultChange({
        netIncome,
        totalCommitment,
        bankCommitment,
        hiddenCommitment,
        dsr: summary.dsr,
        ndi: summary.ndi,
        livingCostBaseline: summary.livingCostBaseline,
        passesCostCheck: summary.passesCostCheck,
        status: summary.verdict,
        debts: bankDebts,
      });
    }
  }, [
    netIncome,
    totalCommitment,
    bankCommitment,
    hiddenCommitment,
    summary,
    bankDebts,
    onResultChange,
  ]);

  const statusColor =
    summary.verdict === "GREEN"
      ? "text-emerald-400"
      : summary.verdict === "YELLOW"
      ? "text-amber-300"
      : summary.verdict === "RED"
      ? "text-crimson-400"
      : "text-crimson-400";

  const statusLabel =
    summary.verdict === "GREEN"
      ? "✅ Within comfort zone"
      : summary.verdict === "YELLOW"
      ? "⚠️ Borderline – needs some mitigation"
      : summary.verdict === "RED"
      ? "🔴 High DSR – strong mitigation required"
      : "❌ Fails Cost-of-Living – NDI below baseline";

  return (
    <Card
      title="Commitment Stack"
      subtitle="All bank and hidden debts in one view, with DSR and cost-of-living checks."
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <NumberInput
            id="cs-housing-inst"
            label="Housing Loan – Installment"
            prefix="RM"
            value={debts.housingInst}
            onChange={(val) =>
              setDebts((p) => ({
                ...p,
                housingInst: val === "" ? "" : Number(val),
              }))
            }
          />
          <NumberInput
            id="cs-housing-bal"
            label="Housing Loan – Outstanding"
            prefix="RM"
            value={debts.housingBal}
            onChange={(val) =>
              setDebts((p) => ({
                ...p,
                housingBal: val === "" ? "" : Number(val),
              }))
            }
            helperText="For mitigation (e.g. refinance / restructure)."
          />
          <NumberInput
            id="cs-car-inst"
            label="Car Loan – Installment"
            prefix="RM"
            value={debts.carInst}
            onChange={(val) =>
              setDebts((p) => ({
                ...p,
                carInst: val === "" ? "" : Number(val),
              }))
            }
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <NumberInput
            id="cs-car-bal"
            label="Car Loan – Outstanding"
            prefix="RM"
            value={debts.carBal}
            onChange={(val) =>
              setDebts((p) => ({
                ...p,
                carBal: val === "" ? "" : Number(val),
              }))
            }
          />
          <NumberInput
            id="cs-personal-inst"
            label="Personal Loan – Installment"
            prefix="RM"
            value={debts.personalInst}
            onChange={(val) =>
              setDebts((p) => ({
                ...p,
                personalInst: val === "" ? "" : Number(val),
              }))
            }
          />
          <NumberInput
            id="cs-personal-bal"
            label="Personal Loan – Outstanding"
            prefix="RM"
            value={debts.personalBal}
            onChange={(val) =>
              setDebts((p) => ({
                ...p,
                personalBal: val === "" ? "" : Number(val),
              }))
            }
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <NumberInput
            id="cs-ptptn-inst"
            label="PTPTN / Study Loan – Installment"
            prefix="RM"
            value={debts.ptptnInst}
            onChange={(val) =>
              setDebts((p) => ({
                ...p,
                ptptnInst: val === "" ? "" : Number(val),
              }))
            }
          />
          <NumberInput
            id="cs-ptptn-bal"
            label="PTPTN / Study Loan – Outstanding"
            prefix="RM"
            value={debts.ptptnBal}
            onChange={(val) =>
              setDebts((p) => ({
                ...p,
                ptptnBal: val === "" ? "" : Number(val),
              }))
            }
          />
          <div>
            <NumberInput
              id="cs-cc-outstanding"
              label="Credit Card Outstanding"
              prefix="RM"
              value={debts.ccOutstanding}
              onChange={(val) =>
                setDebts((p) => ({
                  ...p,
                  ccOutstanding: val === "" ? "" : Number(val),
                }))
              }
              helperText=""
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <span>Min Payment Logic:</span>
                <button
                  type="button"
                  onClick={() =>
                    setDebts((p) => ({
                      ...p,
                      ccRateType: p.ccRateType === "5" ? "1" : "5",
                    }))
                  }
                  className="rounded border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[10px] hover:border-emerald-400/80"
                >
                  {debts.ccRateType === "5" ? "5% of Outstanding" : "1% of Limit"}
                </button>
              </div>
              <span className="text-slate-300">
                Est. RM {ccCommitment.toFixed(2)}/m
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHidden((v) => !v)}
          className="text-[11px] text-slate-300 underline-offset-2 hover:underline"
        >
          {showHidden ? "Hide hidden debts" : "Show hidden debts (Co-op, Pawn, Alimony)"}
        </button>

        {showHidden && (
          <div className="grid gap-3 md:grid-cols-3">
            <NumberInput
              id="cs-coop-inst"
              label="Co-op Loan – Installment"
              prefix="RM"
              value={debts.coopInst}
              onChange={(val) =>
                setDebts((p) => ({
                  ...p,
                  coopInst: val === "" ? "" : Number(val),
                }))
              }
            />
            <NumberInput
              id="cs-coop-bal"
              label="Co-op Loan – Outstanding"
              prefix="RM"
              value={debts.coopBal}
              onChange={(val) =>
                setDebts((p) => ({
                  ...p,
                  coopBal: val === "" ? "" : Number(val),
                }))
              }
            />
            <NumberInput
              id="cs-pawn-inst"
              label="Pawn / Micro Loan – Installment"
              prefix="RM"
              value={debts.pawnInst}
              onChange={(val) =>
                setDebts((p) => ({
                  ...p,
                  pawnInst: val === "" ? "" : Number(val),
                }))
              }
            />
            <NumberInput
              id="cs-pawn-bal"
              label="Pawn / Micro Loan – Outstanding"
              prefix="RM"
              value={debts.pawnBal}
              onChange={(val) =>
                setDebts((p) => ({
                  ...p,
                  pawnBal: val === "" ? "" : Number(val),
                }))
              }
            />
            <NumberInput
              id="cs-alimony-inst"
              label="Alimony / Other Obligations"
              prefix="RM"
              value={debts.alimonyInst}
              onChange={(val) =>
                setDebts((p) => ({
                  ...p,
                  alimonyInst: val === "" ? "" : Number(val),
                }))
              }
            />
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-4 border-t border-slate-800/80 pt-3 text-xs text-slate-200">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Bank Commitments
            </div>
            <div className="text-lg font-semibold">
              {formatCurrency(bankCommitment)}
            </div>
            <div className="text-[11px] text-slate-400">
              Visible in CCRIS / bank system.
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Hidden Commitments
            </div>
            <div className="text-lg font-semibold text-amber-300">
              {formatCurrency(hiddenCommitment)}
            </div>
            <div className="text-[11px] text-slate-400">
              Co-op, pawn, obligations that still affect affordability.
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Total Commitment
            </div>
            <div className="text-lg font-semibold text-slate-50">
              {formatCurrency(totalCommitment)}
            </div>
            <div className="text-[11px] text-slate-400">
              Against net recognised income {formatCurrency(netIncome)}.
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              DSR & NDI
            </div>
            <div className={`text-lg font-semibold ${statusColor}`}>
              {isFinite(summary.dsr)
                ? formatPercent(summary.dsr * 100)
                : "—"}{" "}
              DSR
            </div>
            <div className="text-[11px] text-slate-400">
              NDI {formatCurrency(summary.ndi)} vs baseline{" "}
              {formatCurrency(summary.livingCostBaseline)} (
              {livingProfile?.label || "n/a"}).
            </div>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-300">
          <div className="font-semibold mb-0.5">Result</div>
          <div className={statusColor}>{statusLabel}</div>
        </div>

        <div className="mt-1 max-w-md">
          <Select
            id="cs-living-profile"
            label="Living Cost Profile"
            value={livingProfileId}
            onChange={setLivingProfileId}
            options={livingCostTable.map((p) => ({
              value: p.id,
              label: p.label,
            }))}
            helperText="Used for NDI vs cost-of-living fail check."
          />
        </div>
      </div>
    </Card>
  );
}

export default CommitmentStack;
