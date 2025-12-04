import React from "react";
import Card from "../../../../../components/common/Card.jsx";
import NumberInput from "../../../../../components/common/NumberInput.jsx";
import { loadHandbook } from "../../../../../utils/handbookStorage.js";
import {
  formatCurrency,
  formatPercent,
} from "../../../../../utils/formatters.js";

function computeStatutoryDeductions(basicSalary, children) {
  const salary = Number(basicSalary) || 0;
  if (salary <= 0) {
    return {
      epf: 0,
      socso: 0,
      pcb: 0,
      total: 0,
    };
  }

  // EPF 11%
  const epf = salary * 0.11;

  // Very rough SOCSO approximation
  const socso = Math.min(salary * 0.005, 80);

  // Ultra simplified PCB (income tax) monthly estimate.
  const childRelief = Math.min(children * 100, 500);
  const taxableBase = Math.max(salary - 2500 - childRelief, 0);
  const pcbRate = taxableBase > 8000 ? 0.15 : taxableBase > 4000 ? 0.08 : 0.03;
  const pcb = taxableBase * pcbRate;

  const total = epf + socso + pcb;
  return { epf, socso, pcb, total };
}

function IncomeRecognition({ kyc, onIncomeSummaryChange }) {
  const [inputs, setInputs] = React.useState({
    basicSalary: 0,
    basicStatDedManual: "",
    basicHaircutManual: "",
    fixedAllowance: 0,
    fixedAllowanceHaircutManual: "",
    commission: 0,
    commissionHaircutManual: "",
    bonus: 0,
    bonusHaircutManual: "",
    rental: 0,
    rentalHaircutManual: "",
    other: 0,
    otherHaircutManual: "",
  });

  const children = Number(kyc?.children) || 0;

  const handbook = React.useMemo(() => loadHandbook(), []);

  const incomeTypes = React.useMemo(
    () => [
      {
        key: "basicSalary",
        label: "Basic Salary",
        baseField: "basicSalary",
        haircutManualField: "basicHaircutManual",
        supportsStat: true,
      },
      {
        key: "fixedAllowance",
        label: "Fixed Allowance",
        baseField: "fixedAllowance",
        haircutManualField: "fixedAllowanceHaircutManual",
        supportsStat: false,
      },
      {
        key: "commission",
        label: "Commission / Incentive",
        baseField: "commission",
        haircutManualField: "commissionHaircutManual",
        supportsStat: false,
      },
      {
        key: "bonus",
        label: "Bonus (Averaged)",
        baseField: "bonus",
        haircutManualField: "bonusHaircutManual",
        supportsStat: false,
      },
      {
        key: "rental",
        label: "Rental Income",
        baseField: "rental",
        haircutManualField: "rentalHaircutManual",
        supportsStat: false,
      },
      {
        key: "other",
        label: "Other Income",
        baseField: "other",
        haircutManualField: "otherHaircutManual",
        supportsStat: false,
      },
    ],
    []
  );

  const rows = React.useMemo(() => {
    const hb = loadHandbook(); // Always fetch latest
    const matrix = hb?.incomeMatrix || {};

    const basicSalaryRaw = Number(inputs.basicSalary) || 0;
    const statManual =
      inputs.basicStatDedManual !== "" && inputs.basicStatDedManual !== null;
    const statAuto = computeStatutoryDeductions(basicSalaryRaw, children);
    const statTotal = statManual
      ? Number(inputs.basicStatDedManual) || 0
      : statAuto.total;

    return incomeTypes.map((type) => {
      const raw = Number(inputs[type.baseField]) || 0;
      const matrixCfg = matrix[type.key] || {};
      const defaultHaircut =
        typeof matrixCfg.haircut === "number" ? matrixCfg.haircut : 1;
      const manualHaircutRaw = inputs[type.haircutManualField];
      const isManualHaircut =
        manualHaircutRaw !== "" && manualHaircutRaw !== null;
      const haircutPercent = isManualHaircut
        ? Number(manualHaircutRaw) || 0
        : defaultHaircut * 100;

      const haircutRatio = haircutPercent / 100;

      let statutoryDeduction = 0;
      if (type.key === "basicSalary") {
        statutoryDeduction = statTotal;
      }

      const baseForHaircut =
        type.key === "basicSalary" ? Math.max(raw - statutoryDeduction, 0) : raw;

      const netRecognized = baseForHaircut * haircutRatio;

      return {
        key: type.key,
        label: type.label,
        raw,
        haircutPercent,
        statutoryDeduction,
        netRecognized,
        flags: {
          isManualHaircut,
          isManualStat: type.key === "basicSalary" && statManual,
        },
        meta: {
          defaultHaircutPercent: defaultHaircut * 100,
        },
      };
    });
  }, [inputs, incomeTypes, children]);

  const summary = React.useMemo(() => {
    const totalRaw = rows.reduce((sum, r) => sum + r.raw, 0);
    const totalRecognized = rows.reduce(
      (sum, r) => sum + r.netRecognized,
      0
    );
    return { totalRaw, totalRecognized };
  }, [rows]);

  React.useEffect(() => {
    if (typeof onIncomeSummaryChange === "function") {
      onIncomeSummaryChange({
        totalRawIncome: summary.totalRaw,
        totalNetIncome: summary.totalRecognized,
        rows,
      });
    }
  }, [summary, rows, onIncomeSummaryChange]);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card
      title="Income Recognition Engine"
      subtitle="Matrix view of raw income, statutory deductions, haircuts and final net recognised income."
    >
      <div className="space-y-3">
        <div className="overflow-auto rounded-lg border border-slate-800/80">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Type</th>
                <th className="px-3 py-2 text-right font-medium">Raw</th>
                <th className="px-3 py-2 text-right font-medium">
                  Haircut %
                </th>
                <th className="px-3 py-2 text-right font-medium">
                  Stat Ded
                </th>
                <th className="px-3 py-2 text-right font-medium">
                  Net Recognised
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const typeCfg = incomeTypes.find(
                  (t) => t.key === row.key
                );
                const baseField = typeCfg.baseField;
                const haircutField = typeCfg.haircutManualField;

                return (
                  <tr
                    key={row.key}
                    className="border-t border-slate-800/80 text-slate-200"
                  >
                    <td className="px-3 py-2">{row.label}</td>
                    <td className="px-3 py-2 text-right">
                      <NumberInput
                        id={`inc-${row.key}-raw`}
                        value={inputs[baseField]}
                        onChange={(val) =>
                          handleInputChange(
                            baseField,
                            val === "" ? "" : Number(val)
                          )
                        }
                        prefix="RM"
                        className="!w-32 ml-auto"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <NumberInput
                        id={`inc-${row.key}-haircut`}
                        value={
                          inputs[haircutField] === "" ||
                          inputs[haircutField] === null
                            ? row.haircutPercent
                            : inputs[haircutField]
                        }
                        onChange={(val) =>
                          handleInputChange(
                            haircutField,
                            val === "" ? "" : Number(val)
                          )
                        }
                        suffix="%"
                        className={`!w-24 ml-auto ${
                          row.flags.isManualHaircut
                            ? "!border-amber-400/80 bg-amber-500/10"
                            : ""
                        }`}
                        helperText=""
                      />
                      {!row.flags.isManualHaircut && (
                        <div className="mt-0.5 text-[10px] text-slate-500">
                          Default{" "}
                          {formatPercent(row.meta.defaultHaircutPercent)}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row.key === "basicSalary" ? (
                        <NumberInput
                          id="inc-basic-stat"
                          value={
                            inputs.basicStatDedManual === "" ||
                            inputs.basicStatDedManual === null
                              ? row.statutoryDeduction
                              : inputs.basicStatDedManual
                          }
                          onChange={(val) =>
                            handleInputChange(
                              "basicStatDedManual",
                              val === "" ? "" : Number(val)
                            )
                          }
                          prefix="RM"
                          className={`!w-28 ml-auto ${
                            row.flags.isManualStat
                              ? "!border-amber-400/80 bg-amber-500/10"
                              : ""
                          }`}
                          helperText=""
                        />
                      ) : (
                        <span className="text-slate-400">
                          {formatCurrency(row.statutoryDeduction)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="font-semibold text-emerald-300">
                        {formatCurrency(row.netRecognized)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-900/80 text-slate-200">
              <tr>
                <td className="px-3 py-2 text-right font-semibold" colSpan={3}>
                  Totals
                </td>
                <td className="px-3 py-2 text-right text-slate-300">
                  {formatCurrency(
                    rows.find((r) => r.key === "basicSalary")
                      ?.statutoryDeduction || 0
                  )}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-emerald-400">
                  {formatCurrency(summary.totalRecognized)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="grid gap-3 md:grid-cols-2 text-[11px] text-slate-300">
          <div>
            <div className="font-semibold text-slate-200">
              Net Recognised Income
            </div>
            <div className="text-slate-400">
              Raw monthly income of{" "}
              <span className="font-semibold">
                {formatCurrency(summary.totalRaw)}
              </span>{" "}
              becomes{" "}
              <span className="font-semibold text-emerald-400">
                {formatCurrency(summary.totalRecognized)}
              </span>{" "}
              after statutory deductions and bank haircuts.
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-200">
              Auto–Manual Hybrid Logic
            </div>
            <div className="text-slate-400">
              Fields highlighted in amber are manually overridden. Everything
              else follows the live{" "}
              <span className="font-semibold">Handbook</span> parameters and
              internal tax assumptions.
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default IncomeRecognition;
