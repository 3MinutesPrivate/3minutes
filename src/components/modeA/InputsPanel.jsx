import React, { useEffect, useState } from "react";
import NumberInput from "../common/NumberInput";
import Select from "../common/Select";
import Tooltip from "../common/Tooltip";
import { calculateMonthlyInstallment } from "../../utils/financialEngine";
import { useHiveMindDefaults } from "../../hooks/useHiveMindDefaults";

function InputsPanel({ onStateChange }) {
  const { defaults } = useHiveMindDefaults();
  const [propertyValue, setPropertyValue] = useState(500000);
  const [downpaymentPercent, setDownpaymentPercent] = useState(10);
  const [downpaymentAmount, setDownpaymentAmount] = useState(50000);
  const [loanPrincipal, setLoanPrincipal] = useState(450000);
  const [loanPrincipalOverridden, setLoanPrincipalOverridden] = useState(false);
  const [interestRate, setInterestRate] = useState(defaults.interestRate || 4.1);
  const [tenureYears, setTenureYears] = useState(35);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [installment, setInstallment] = useState(0);

  // Sync interest default from Hive Mind
  useEffect(() => {
    if (defaults && typeof defaults.interestRate === "number") {
      setInterestRate(defaults.interestRate);
    }
  }, [defaults]);

  // Two-way binding for downpayment RM <-> %
  useEffect(() => {
    const amount = Math.round((propertyValue * downpaymentPercent) / 100);
    setDownpaymentAmount(amount);
    if (!loanPrincipalOverridden) {
      setLoanPrincipal(propertyValue - amount);
    }
  }, [propertyValue, downpaymentPercent, loanPrincipalOverridden]);

  useEffect(() => {
    const principal = loanPrincipal;
    const rate = interestRate;
    if (principal > 0 && rate > 0 && tenureYears > 0) {
      const monthly = calculateMonthlyInstallment(principal, rate, tenureYears);
      setInstallment(monthly);
      const state = {
        propertyValue,
        downpaymentPercent,
        downpaymentAmount,
        loanPrincipal,
        interestRate,
        tenureYears,
        startDate,
        installment: monthly,
      };
      onStateChange && onStateChange(state);
    }
  }, [
    propertyValue,
    downpaymentAmount,
    loanPrincipal,
    interestRate,
    tenureYears,
    startDate,
    onStateChange,
  ]);

  const tenureOptions = Array.from({ length: 35 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} year${i + 1 > 1 ? "s" : ""}`,
  }));

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <NumberInput
        id="property-value"
        label="Property Value"
        prefix="RM"
        value={propertyValue}
        onChange={(val) => {
          if (val === "") {
            setPropertyValue(0);
            return;
          }
          setPropertyValue(Number(val));
        }}
        helperText="Enter the purchase price."
      />

      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          id="downpayment-percent"
          label="Downpayment (%)"
          suffix="%"
          value={downpaymentPercent}
          onChange={(val) => {
            if (val === "") {
              setDownpaymentPercent(0);
              return;
            }
            const v = Math.max(0, Math.min(100, Number(val)));
            setDownpaymentPercent(v);
          }}
        />
        <NumberInput
          id="downpayment-amount"
          label="Downpayment (RM)"
          prefix="RM"
          value={downpaymentAmount}
          onChange={(val) => {
            if (val === "") {
              setDownpaymentAmount(0);
              return;
            }
            const amount = Math.min(Number(val), propertyValue);
            setDownpaymentAmount(amount);
            const pct =
              propertyValue > 0 ? (amount / propertyValue) * 100 : 0;
            setDownpaymentPercent(Math.round(pct * 100) / 100);
          }}
        />
      </div>

      <NumberInput
        id="loan-principal"
        label="Loan Principal"
        prefix="RM"
        value={loanPrincipal}
        onChange={(val) => {
          if (val === "") {
            setLoanPrincipal(0);
            setLoanPrincipalOverridden(true);
            return;
          }
          setLoanPrincipal(Number(val));
          setLoanPrincipalOverridden(true);
        }}
        helperText="You can override this if the bank structure differs."
      />

      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          id="interest-rate"
          label={
            <span className="inline-flex items-center gap-1">
              Interest Rate
              <Tooltip content="Based on SBR + spread. Updated from market hive data.">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[9px] text-slate-300">
                  i
                </span>
              </Tooltip>
            </span>
          }
          suffix="% p.a."
          value={interestRate}
          onChange={(val) => {
            if (val === "") {
              setInterestRate(0);
              return;
            }
            setInterestRate(Number(val));
          }}
        />
        <Select
          id="tenure"
          label="Tenure"
          value={String(tenureYears)}
          onChange={(val) => setTenureYears(Number(val))}
          options={tenureOptions}
          helperText="Max 35 years"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="start-date"
          className="mb-1 text-xs font-medium text-slate-200"
        >
          Start Date
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400/90 focus:ring-1 focus:ring-emerald-500/60"
        />
      </div>

      <NumberInput
        id="installment"
        label="Estimated Installment"
        prefix="RM"
        value={installment}
        onChange={() => {}}
        helperText="Rounded up to 2 decimals. Bank final amount may vary slightly."
        disabled
      />
    </div>
  );
}

export default InputsPanel;
