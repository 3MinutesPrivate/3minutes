import React from "react";
import Card from "../../../../../components/common/Card.jsx";
import NumberInput from "../../../../../components/common/NumberInput.jsx";
import Select from "../../../../../components/common/Select.jsx";
import Tabs from "../../../../../components/common/Tabs.jsx";
import { useLocalStorage } from "../../../../../hooks/useLocalStorage.js";
import { simulateFlexiLoan } from "../../../../../utils/flexiEngine.js";
import {
  formatCurrency,
  formatDate,
} from "../../../../../utils/formatters.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DEFAULT_BENEFITS = [
  { id: "no-lock-in", label: "No Lock-in", checked: true },
  { id: "no-cap", label: "No Cap on prepayment", checked: true },
];

function FlexiSimulator({ baseCalcState }) {
  const [loanType, setLoanType] = React.useState("semi-flexi");
  const [paymentMethod, setPaymentMethod] =
    React.useState("auto-debit");
  const [advanceAmount, setAdvanceAmount] = React.useState(10000);
  const [advanceDate, setAdvanceDate] = React.useState(() => {
    if (!baseCalcState?.startDate) {
      return new Date().toISOString().slice(0, 10);
    }
    const d = new Date(baseCalcState.startDate);
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().slice(0, 10);
  });

  const [benefits, setBenefits] = useLocalStorage(
    "3m_flexi_benefits",
    DEFAULT_BENEFITS
  );
  const [newBenefitLabel, setNewBenefitLabel] = React.useState("");

  React.useEffect(() => {
    if (!baseCalcState?.startDate) return;
    const d = new Date(baseCalcState.startDate);
    d.setMonth(d.getMonth() + 6);
    setAdvanceDate(d.toISOString().slice(0, 10));
  }, [baseCalcState?.startDate]);

  const simulation = React.useMemo(() => {
    if (!baseCalcState) return null;
    const {
      loanPrincipal,
      interestRate,
      tenureYears,
      startDate,
      installment,
    } = baseCalcState;
    if (!loanPrincipal || !interestRate || !tenureYears || !startDate) {
      return null;
    }
    return simulateFlexiLoan({
      principal: loanPrincipal,
      annualRate: interestRate,
      tenureYears,
      startDate,
      baseInstallment: installment,
      loanType,
      paymentMethod,
      advanceAmount,
      advanceDate,
    });
  }, [
    baseCalcState,
    loanType,
    paymentMethod,
    advanceAmount,
    advanceDate,
  ]);

  if (!baseCalcState) {
    return (
      <Card
        title="Flexi Loan Simulator"
        subtitle="Run the 3M Calculator first, then visualize flexi savings."
      >
        <p className="text-xs text-slate-400">
          Once you have a base loan structure, this module will show how
          advance payments and flexi features reduce interest using daily
          rest logic.
        </p>
      </Card>
    );
  }

  const timelineEvents = simulation?.events || [];
  const chartData = simulation?.points || [];

  const handleToggleBenefit = (id) => {
    setBenefits((prev) =>
      prev.map((b) => (b.id === id ? { ...b, checked: !b.checked } : b))
    );
  };

  const handleAddBenefit = (e) => {
    e.preventDefault();
    const label = newBenefitLabel.trim();
    if (!label) return;
    setBenefits((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        label,
        checked: true,
      },
    ]);
    setNewBenefitLabel("");
  };

  const loanTypeTabs = [
    { id: "semi-flexi", label: "Semi-Flexi" },
    { id: "full-flexi", label: "Full-Flexi" },
  ];

  const paymentMethodOptions = [
    { value: "auto-debit", label: "Auto Debit" },
    { value: "regular-payment", label: "Regular Payment" },
    { value: "principal-repayment", label: "Principal Repayment" },
  ];

  return (
    <Card
      title="Flexi Loan Simulator"
      subtitle="See how advance payments and flexi features save interest with daily rest logic."
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-3">
            <Tabs
              tabs={loanTypeTabs}
              activeId={loanType}
              onChange={setLoanType}
            />
            <Select
              id="flexi-payment-method"
              label="Payment Method"
              value={paymentMethod}
              onChange={setPaymentMethod}
              options={paymentMethodOptions}
            />
          </div>

          <NumberInput
            id="flexi-advance-amount"
            label="Advance Payment"
            prefix="RM"
            value={advanceAmount}
            onChange={(val) => {
              if (val === "") {
                setAdvanceAmount(0);
              } else {
                setAdvanceAmount(Number(val));
              }
            }}
            helperText="Lump sum parked into flexi savings account."
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="flexi-advance-date"
              className="mb-1 text-xs font-medium text-slate-200"
            >
              Advance Payment Date
            </label>
            <input
              id="flexi-advance-date"
              type="date"
              value={advanceDate}
              onChange={(e) => setAdvanceDate(e.target.value)}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400/90 focus:ring-1 focus:ring-emerald-500/60"
            />
            <p className="text-[11px] text-slate-400">
              Interest = (Outstanding - Bucket) × Rate / 365 on each day.
              Earlier and larger advance payments generate more savings.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1F2937"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickFormatter={(v) =>
                    v >= 1000 ? `${Math.round(v / 1000)}k` : v
                  }
                />
                <RechartsTooltip
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => label}
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1F2937",
                    fontSize: 11,
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => (
                    <span style={{ color: "#E5E7EB" }}>{value}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="hlBalance"
                  name="HL Balance"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="saBalance"
                  name="SA Balance"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="bucketBalance"
                  name="Installment Bucket"
                  stroke="#FBBF24"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-xs font-semibold text-slate-200 mb-1">
                Flexi Benefits
              </div>
              <div className="space-y-1.5">
                {benefits.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleToggleBenefit(b.id)}
                    className={`flex w-full items-center justify-between rounded-md border px-2 py-1 text-[11px] transition
                    ${
                      b.checked
                        ? "border-emerald-500/70 bg-emerald-500/10 text-emerald-300"
                        : "border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-emerald-400/80"
                    }`}
                  >
                    <span>{b.label}</span>
                    <span className="ml-2 text-xs">
                      {b.checked ? "✅" : "➕"}
                    </span>
                  </button>
                ))}
              </div>
              <form
                onSubmit={handleAddBenefit}
                className="mt-2 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newBenefitLabel}
                  onChange={(e) => setNewBenefitLabel(e.target.value)}
                  placeholder="Add custom benefit"
                  className="flex-1 rounded-md border border-slate-700/80 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-emerald-400/90 focus:ring-1 focus:ring-emerald-500/60"
                />
                <button
                  type="submit"
                  className="rounded-md bg-slate-800 px-2 py-1 text-[11px] text-slate-100 hover:bg-slate-700"
                >
                  Add
                </button>
              </form>
            </div>

            {simulation && (
              <div className="text-[11px] text-slate-300 space-y-1 border-t border-slate-800/80 pt-2">
                <div className="font-semibold text-emerald-400">
                  Estimated Interest Savings:{" "}
                  {formatCurrency(simulation.summary.interestSavings || 0)}
                </div>
                <div className="text-slate-400">
                  vs non-flexi structure over the same horizon.
                </div>
                <div className="text-slate-400">
                  Payoff impact:{" "}
                  {simulation.summary.earlierPayoffDate
                    ? `potentially earlier by ${simulation.summary.earlierByMonths} months (to ${formatDate(
                        simulation.summary.earlierPayoffDate
                      )}).`
                    : "no significant change in payoff date at this advance level."}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-auto rounded-lg border border-slate-800/80 p-3">
          <div className="text-xs font-semibold text-slate-200 mb-1">
            Timeline of Events
          </div>
          {timelineEvents.length === 0 && (
            <p className="text-[11px] text-slate-400">
              No events generated yet. Adjust the advance payment and run
              a quick simulation.
            </p>
          )}
          {timelineEvents.map((ev) => (
            <div
              key={ev.id}
              className="relative pl-4 pb-2 text-[11px] text-slate-200"
            >
              <div className="absolute left-0 top-1 h-2 w-2 rounded-full bg-emerald-500" />
              <div className="text-[10px] text-slate-400">
                {formatDate(ev.date)}
              </div>
              <div className="font-semibold">{ev.title}</div>
              {ev.description && (
                <div className="text-slate-400">{ev.description}</div>
              )}
              <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-slate-400">
                <span>
                  HL: {formatCurrency(ev.hlBalance || 0)} | SA:{" "}
                  {formatCurrency(ev.saBalance || 0)}
                </span>
                {"bucketBalance" in ev && (
                  <span>
                    Bucket: {formatCurrency(ev.bucketBalance || 0)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default FlexiSimulator;
