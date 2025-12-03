import React, { useEffect, useState } from "react";
import Card from "../common/Card";
import NumberInput from "../common/NumberInput";
import Slider from "../common/Slider";
import Toggle from "../common/Toggle";
import {
  calculateMonthlyInstallment,
  calculateEntryCosts,
} from "../../utils/financialEngine";
import { formatCurrency, formatPercent } from "../../utils/formatters";
import { useHiveMindDefaults } from "../../hooks/useHiveMindDefaults";
import { useAppContext } from "../../context/AppContext";
import { buildAgentQuoteMessage } from "../../utils/whatsappExport";

function SnapQuote({ onQuoteChange }) {
  const { defaults } = useHiveMindDefaults();
  const { user } = useAppContext();

  const [price, setPrice] = useState(500000);
  const [rate, setRate] = useState(defaults.interestRate || 4.1);
  const [tenureYears, setTenureYears] = useState(35);
  const [margin, setMargin] = useState(90);
  const [rebatePercent, setRebatePercent] = useState(0);
  const [showEntryCost, setShowEntryCost] = useState(false);
  const [entryCosts, setEntryCosts] = useState(null);

  useEffect(() => {
    if (defaults && typeof defaults.interestRate === "number") {
      setRate(defaults.interestRate);
    }
  }, [defaults]);

  const loanAmount = React.useMemo(
    () => Math.round((price * margin) / 100),
    [price, margin]
  );

  const netPrice = React.useMemo(
    () => Math.round(price * (1 - rebatePercent / 100)),
    [price, rebatePercent]
  );

  const cashBack = React.useMemo(() => {
    const diff = loanAmount - netPrice;
    return diff > 0 ? diff : 0;
  }, [loanAmount, netPrice]);

  const installment = React.useMemo(() => {
    if (!loanAmount || !rate || !tenureYears) return 0;
    return calculateMonthlyInstallment(loanAmount, rate, tenureYears);
  }, [loanAmount, rate, tenureYears]);

  useEffect(() => {
    if (!showEntryCost) {
      setEntryCosts(null);
      return;
    }
    const costs = calculateEntryCosts(price, loanAmount);
    setEntryCosts(costs);
  }, [showEntryCost, price, loanAmount]);

  useEffect(() => {
    if (!onQuoteChange) return;
    onQuoteChange({
      loanAmount,
      monthlyInstallment: installment,
      propertyValue: price,
      interestRate: rate,
      tenureYears,
      margin,
      netPrice,
      cashBack,
    });
  }, [
    loanAmount,
    installment,
    price,
    rate,
    tenureYears,
    margin,
    netPrice,
    cashBack,
    onQuoteChange,
  ]);

  const tenureOptions = Array.from({ length: 35 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} year${i + 1 > 1 ? "s" : ""}`,
  }));

  const handleShare = async () => {
    const msg = buildAgentQuoteMessage({
      agentName: user?.name,
      agentPhone: user?.phone,
      price,
      rate,
      tenureYears,
      margin,
      loanAmount,
      netPrice,
      cashBack,
      installment,
      entryCosts,
    });

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(msg);
      }
    } catch {
      // ignore clipboard errors
    }

    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      title="Snap Quote"
      subtitle="One-swipe quotation for fast closing."
      highlight
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <NumberInput
            id="sq-price"
            label="Property Price"
            prefix="RM"
            value={price}
            onChange={(val) => {
              if (val === "") {
                setPrice(0);
              } else {
                setPrice(Number(val));
              }
            }}
          />
          <NumberInput
            id="sq-rate"
            label="Rate"
            suffix="% p.a."
            value={rate}
            onChange={(val) => {
              if (val === "") {
                setRate(0);
              } else {
                setRate(Number(val));
              }
            }}
          />
          <div>
            <label
              htmlFor="sq-tenure"
              className="mb-1 block text-xs font-medium text-slate-200"
            >
              Tenure
            </label>
            <select
              id="sq-tenure"
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
              Max 35 years
            </p>
          </div>
          <NumberInput
            id="sq-margin"
            label="Margin"
            suffix="%"
            value={margin}
            onChange={(val) => {
              if (val === "") {
                setMargin(0);
              } else {
                const v = Math.max(0, Math.min(100, Number(val)));
                setMargin(v);
              }
            }}
            helperText="Typical residential margin is 90%."
          />
        </div>

        <Slider
          id="sq-rebate"
          label="Developer Rebate"
          value={rebatePercent}
          onChange={setRebatePercent}
          min={0}
          max={20}
          step={0.5}
          formatValue={(v) => `${v.toFixed(1)}%`}
          helperText="Use this to quickly explain net price and cash back."
        />

        <div className="grid gap-3 md:grid-cols-4 text-xs text-slate-200">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Loan Amount
            </div>
            <div className="text-lg font-semibold">
              {formatCurrency(loanAmount)}
            </div>
            <div className="text-[11px] text-slate-400">
              {formatPercent(margin)} margin
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Net Price
            </div>
            <div className="text-lg font-semibold text-emerald-400">
              {formatCurrency(netPrice)}
            </div>
            <div className="text-[11px] text-slate-400">
              After {formatPercent(rebatePercent)} rebate
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Cash Back (Est.)
            </div>
            <div className="text-lg font-semibold text-emerald-300">
              {formatCurrency(cashBack)}
            </div>
            <div className="text-[11px] text-slate-400">
              If loan &gt; net price
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Monthly Installment
            </div>
            <div className="text-lg font-semibold text-slate-50">
              {formatCurrency(installment)}
            </div>
            <div className="text-[11px] text-slate-400">
              Bank rounding may differ slightly.
            </div>
          </div>
        </div>

        <Toggle
          id="sq-entry"
          checked={showEntryCost}
          onChange={setShowEntryCost}
          label="Show Entry Costs (Legal Fee & Stamp Duty)"
          description="Based on SRO 2023 tiered structure for MOT and loan."
        />

        {showEntryCost && entryCosts && (
          <div className="grid gap-3 md:grid-cols-4 text-[11px] text-slate-200 border-t border-slate-800/80 pt-3">
            <div>
              <div className="text-slate-400">MOT Stamp Duty</div>
              <div className="text-sm font-semibold">
                {formatCurrency(entryCosts.motStampDuty)}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Loan Stamp Duty</div>
              <div className="text-sm font-semibold">
                {formatCurrency(entryCosts.loanStampDuty)}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Legal Fees</div>
              <div className="text-sm font-semibold">
                {formatCurrency(entryCosts.legalFee)}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Total Entry Cost</div>
              <div className="text-sm font-semibold text-crimson-400">
                {formatCurrency(entryCosts.total)}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <p className="text-[11px] text-slate-400">
            Use this as a quick “yes/no” affordability and cashback
            conversation starter.
          </p>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Share Quote (WhatsApp)
          </button>
        </div>
      </div>
    </Card>
  );
}

export default SnapQuote;
