import React from "react";
import Card from "../common/Card";
import NumberInput from "../common/NumberInput";
import Select from "../common/Select";
import documentChecklist from "../../data/documentChecklist.json";
import { calculateMaxPropertyPriceFromBudget } from "../../utils/financialEngine";
import { formatCurrency, formatPercent } from "../../utils/formatters";

function HelperTools() {
  // Smart Checklist
  const personaOptions = Array.isArray(documentChecklist)
    ? documentChecklist.map((p) => ({
        value: p.id,
        label: p.label,
      }))
    : [];

  const [selectedPersonaId, setSelectedPersonaId] = React.useState(
    personaOptions[0]?.value || ""
  );

  const selectedPersona = React.useMemo(
    () =>
      Array.isArray(documentChecklist)
        ? documentChecklist.find((p) => p.id === selectedPersonaId)
        : null,
    [selectedPersonaId]
  );

  // Reverse Calc
  const [monthlyBudget, setMonthlyBudget] = React.useState(2500);
  const [rate, setRate] = React.useState(4.1);
  const [tenureYears, setTenureYears] = React.useState(35);
  const [margin, setMargin] = React.useState(90);

  const reverseResult = React.useMemo(() => {
    if (!monthlyBudget || !rate || !tenureYears || !margin) {
      return null;
    }
    return calculateMaxPropertyPriceFromBudget({
      monthlyBudget,
      annualRate: rate,
      tenureYears,
      marginPercent: margin,
    });
  }, [monthlyBudget, rate, tenureYears, margin]);

  const tenureOptions = Array.from({ length: 35 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} year${i + 1 > 1 ? "s" : ""}`,
  }));

  return (
    <div className="space-y-4">
      <Card
        title="Smart Checklist"
        subtitle="Different profiles, different documents. Avoid surprises on submission day."
      >
        <div className="space-y-3">
          <Select
            id="helper-persona"
            label="Client Persona"
            value={selectedPersonaId}
            onChange={setSelectedPersonaId}
            options={personaOptions}
            placeholder="Select a profile"
          />
          {selectedPersona ? (
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/80 p-3 text-xs text-slate-200">
              <div className="mb-1 text-[11px] font-semibold text-slate-300">
                Required Documents ({selectedPersona.label})
              </div>
              <ul className="list-disc space-y-1 pl-4">
                {selectedPersona.documents.map((doc) => (
                  <li key={doc.id || doc.label}>{doc.label}</li>
                ))}
              </ul>
              {selectedPersona.notes && (
                <p className="mt-2 text-[11px] text-slate-400">
                  {selectedPersona.notes}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Configure personas and document requirements in{" "}
              <code>documentChecklist.json</code>.
            </p>
          )}
        </div>
      </Card>

      <Card
        title="Reverse Calculator"
        subtitle="Start from client’s monthly budget and work backwards to max property price."
      >
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <NumberInput
              id="rev-budget"
              label="Monthly Budget"
              prefix="RM"
              value={monthlyBudget}
              onChange={(val) => {
                if (val === "") setMonthlyBudget(0);
                else setMonthlyBudget(Number(val));
              }}
              helperText="How much can they comfortably pay every month?"
            />
            <NumberInput
              id="rev-rate"
              label="Rate"
              suffix="% p.a."
              value={rate}
              onChange={(val) => {
                if (val === "") setRate(0);
                else setRate(Number(val));
              }}
            />
            <div>
              <label
                htmlFor="rev-tenure"
                className="mb-1 block text-xs font-medium text-slate-200"
              >
                Tenure
              </label>
              <select
                id="rev-tenure"
                value={String(tenureYears)}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400/90 focus:ring-1 focus:ring-emerald-500/60"
              >
                {tenureOptions.map((t) => (
                  <option
                    key={t.value}
                    value={t.value}
                    className="bg-slate-900 text-slate-100"
                  >
                    {t.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-400">
                Max 35 years or bank policy.
              </p>
            </div>
            <NumberInput
              id="rev-margin"
              label="Margin"
              suffix="%"
              value={margin}
              onChange={(val) => {
                if (val === "") setMargin(0);
                else {
                  const v = Math.max(0, Math.min(100, Number(val)));
                  setMargin(v);
                }
              }}
              helperText="Typical 90% for first residential property."
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3 text-xs text-slate-200 border-t border-slate-800/80 pt-3">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-400">
                Max Loan Amount
              </div>
              <div className="text-lg font-semibold">
                {reverseResult
                  ? formatCurrency(reverseResult.maxLoanAmount)
                  : "—"}
              </div>
              <div className="text-[11px] text-slate-400">
                Based on budget {formatCurrency(monthlyBudget)}.
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-400">
                Max Property Price
              </div>
              <div className="text-lg font-semibold text-emerald-400">
                {reverseResult
                  ? formatCurrency(reverseResult.maxPropertyPrice)
                  : "—"}
              </div>
              <div className="text-[11px] text-slate-400">
                Assuming margin {formatPercent(margin)}.
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-400">
                Implied DSR (Budget Only)
              </div>
              <div className="text-lg font-semibold text-slate-50">
                {reverseResult
                  ? formatPercent(reverseResult.impliedDsr * 100)
                  : "—"}
              </div>
              <div className="text-[11px] text-slate-400">
                Quick sense-check using 60% reference line.
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Use this when client says “I can do RM {monthlyBudget.toFixed(0)} a
            month” but has no idea what property price range that supports.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default HelperTools;
