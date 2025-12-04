import React from "react";
import Card from "../../../../../components/common/Card.jsx";
import NumberInput from "../../../../../components/common/NumberInput.jsx";
import {
  loadHandbook,
  saveHandbook,
} from "../../../../../utils/handbookStorage.js";
import { formatPercent } from "../../../../../utils/formatters.js";

function HandbookSettings() {
  const [handbook, setHandbook] = React.useState(() => loadHandbook());
  const [savedAt, setSavedAt] = React.useState(null);

  const global = handbook.global || {};
  const incomeMatrix = handbook.incomeMatrix || {};
  const bankStrategies = handbook.bankStrategies || {};

  const updateField = (path, value) => {
    setHandbook((prev) => {
      const next = { ...prev };
      let cursor = next;
      for (let i = 0; i < path.length - 1; i += 1) {
        const key = path[i];
        cursor[key] = cursor[key] || {};
        cursor = cursor[key];
      }
      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const handleSave = () => {
    saveHandbook(handbook);
    setSavedAt(new Date());
  };

  const getIncomeHaircutPercent = (key) => {
    const cfg = incomeMatrix[key] || {};
    const ratio =
      typeof cfg.haircut === "number" && !Number.isNaN(cfg.haircut)
        ? cfg.haircut
        : 1;
    return Math.round(ratio * 1000) / 10;
  };

  const setIncomeHaircutPercent = (key, percent) => {
    const ratio = (Number(percent) || 0) / 100;
    updateField(["incomeMatrix", key, "haircut"], ratio);
  };

  const dsrDefaultLimit =
    typeof bankStrategies.defaultDsrLimit === "number"
      ? bankStrategies.defaultDsrLimit
      : 0.6;

  const banks = Array.isArray(bankStrategies.banks)
    ? bankStrategies.banks
    : [];

  const updateBank = (id, field, value) => {
    setHandbook((prev) => {
      const next = { ...prev };
      const list = Array.isArray(next.bankStrategies?.banks)
        ? [...next.bankStrategies.banks]
        : [];
      const idx = list.findIndex((b) => b.id === id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          [field]: value,
        };
      }
      next.bankStrategies = {
        ...(next.bankStrategies || {}),
        banks: list,
      };
      return next;
    });
  };

  return (
    <Card
      title="Handbook – Engine Room"
      subtitle="Central parameters for tenure, age, income haircuts and per-bank DSR strategies."
    >
      <div className="space-y-4 text-xs text-slate-200">
        <div className="grid gap-3 md:grid-cols-3">
          <NumberInput
            id="hb-max-tenure"
            label="Global Max Tenure"
            suffix="years"
            value={global.maxTenure ?? 35}
            onChange={(val) =>
              updateField(
                ["global", "maxTenure"],
                val === "" ? 35 : Number(val)
              )
            }
            helperText="Soft cap for calculators and mitigation logic."
          />
          <NumberInput
            id="hb-max-age"
            label="Global Max Age at Maturity"
            suffix="years"
            value={global.maxAge ?? 70}
            onChange={(val) =>
              updateField(
                ["global", "maxAge"],
                val === "" ? 70 : Number(val)
              )
            }
            helperText="Used for unofficial tenure guidance."
          />
          <NumberInput
            id="hb-default-dsr"
            label="Default DSR Comfort Limit"
            suffix="%"
            value={Math.round(dsrDefaultLimit * 1000) / 10}
            onChange={(val) => {
              const ratio = (Number(val) || 0) / 100;
              updateField(["bankStrategies", "defaultDsrLimit"], ratio);
            }}
            helperText="Reference line for GREEN/YELLOW/RED classification."
          />
        </div>

        <div className="border-t border-slate-800/80 pt-3">
          <div className="mb-2 text-[11px] font-semibold text-slate-300">
            Income Haircut Matrix
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <NumberInput
              id="hb-hc-commission"
              label="Commission"
              suffix="%"
              value={getIncomeHaircutPercent("commission")}
              onChange={(val) =>
                setIncomeHaircutPercent("commission", val === "" ? 0 : val)
              }
              helperText={`Default ${
                formatPercent(getIncomeHaircutPercent("commission")) || ""
              } of average banked amount.`}
            />
            <NumberInput
              id="hb-hc-bonus"
              label="Bonus"
              suffix="%"
              value={getIncomeHaircutPercent("bonus")}
              onChange={(val) =>
                setIncomeHaircutPercent("bonus", val === "" ? 0 : val)
              }
              helperText="Typically averaged over 6–12 months."
            />
            <NumberInput
              id="hb-hc-rental"
              label="Rental Income"
              suffix="%"
              value={getIncomeHaircutPercent("rental")}
              onChange={(val) =>
                setIncomeHaircutPercent("rental", val === "" ? 0 : val)
              }
              helperText="Net of obligations (e.g. instalments on rented units)."
            />
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-3">
          <div className="mb-2 text-[11px] font-semibold text-slate-300">
            Per-bank DSR Strategies
          </div>
          {banks.length === 0 ? (
            <p className="text-[11px] text-slate-400">
              Configure bank strategy data inside <code>handbook.json</code> to
              fine-tune this section.
            </p>
          ) : (
            <div className="overflow-auto rounded-lg border border-slate-800/80">
              <table className="min-w-full text-[11px]">
                <thead className="bg-slate-900/80 text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Bank</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Tier 1 DSR
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      Tier 2 DSR
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map((bank) => (
                    <tr
                      key={bank.id}
                      className="border-t border-slate-800/80 text-slate-200"
                    >
                      <td className="px-3 py-2">{bank.name}</td>
                      <td className="px-3 py-2 text-right">
                        <NumberInput
                          id={`hb-bank-${bank.id}-tier1`}
                          value={
                            Math.round(
                              (bank.tier1Limit ?? dsrDefaultLimit) * 1000
                            ) / 10
                          }
                          onChange={(val) =>
                            updateBank(
                              bank.id,
                              "tier1Limit",
                              (Number(val) || 0) / 100
                            )
                          }
                          suffix="%"
                          className="!w-20 ml-auto"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <NumberInput
                          id={`hb-bank-${bank.id}-tier2`}
                          value={
                            Math.round((bank.tier2Limit ?? 0.7) * 1000) / 10
                          }
                          onChange={(val) =>
                            updateBank(
                              bank.id,
                              "tier2Limit",
                              (Number(val) || 0) / 100
                            )
                          }
                          suffix="%"
                          className="!w-20 ml-auto"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="text"
                          value={bank.notes || ""}
                          onChange={(e) =>
                            updateBank(bank.id, "notes", e.target.value)
                          }
                          className="w-full rounded border border-slate-700/80 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-500/60"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <p className="text-[11px] text-slate-400">
            Changes are stored locally in this browser only. Always cross-check
            with the latest official bank handbook.
          </p>
          <div className="flex items-center gap-2">
            {savedAt && (
              <span className="text-[10px] text-emerald-400">
                Saved {savedAt.toLocaleTimeString()}
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:bg-slate-700"
            >
              Save Handbook
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default HandbookSettings;
