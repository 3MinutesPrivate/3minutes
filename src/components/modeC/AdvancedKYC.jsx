import React from "react";
import Card from "../common/Card";
import NumberInput from "../common/NumberInput";
import Select from "../common/Select";

function AdvancedKYC({ value, onChange }) {
  const [form, setForm] = React.useState(
    value || {
      age: "",
      maritalStatus: "single",
      children: 0,
      residentStatus: "resident",
    }
  );

  React.useEffect(() => {
    if (value) {
      setForm((prev) => ({
        ...prev,
        ...value,
      }));
    }
  }, [value]);

  const updateField = (field, fieldValue) => {
    setForm((prev) => {
      const next = { ...prev, [field]: fieldValue };
      onChange && onChange(next);
      return next;
    });
  };

  const ageNumber = Number(form.age) || 0;
  const maxAgeAtMaturity = 70;
  const remainingYears =
    ageNumber > 0 ? Math.max(maxAgeAtMaturity - ageNumber, 0) : null;
  const suggestedMaxTenure =
    remainingYears !== null ? Math.min(35, remainingYears) : null;

  return (
    <Card
      title="Advanced KYC"
      subtitle="Age, family profile and residency drive policy, LTV and tax logic."
    >
      <div className="grid gap-3 md:grid-cols-4">
        <NumberInput
          id="kyc-age"
          label="Age"
          value={form.age}
          onChange={(val) => updateField("age", val === "" ? "" : Number(val))}
          helperText="Used for max tenure and age-at-maturity checks."
        />

        <Select
          id="kyc-marital"
          label="Marital Status"
          value={form.maritalStatus}
          onChange={(val) => updateField("maritalStatus", val)}
          options={[
            { value: "single", label: "Single" },
            { value: "married", label: "Married" },
            { value: "divorced", label: "Divorced" },
            { value: "widowed", label: "Widowed" },
          ]}
        />

        <NumberInput
          id="kyc-children"
          label="Number of Children"
          value={form.children}
          onChange={(val) =>
            updateField("children", val === "" ? 0 : Number(val))
          }
          helperText="Impacts PCB/tax assumptions in income recognition."
        />

        <Select
          id="kyc-resident"
          label="Resident Status"
          value={form.residentStatus}
          onChange={(val) => updateField("residentStatus", val)}
          options={[
            { value: "resident", label: "Resident" },
            { value: "non-resident", label: "Non-Resident" },
          ]}
          helperText="Non-residents may face stricter LTV caps."
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3 text-[11px] text-slate-300">
        <div>
          <div className="font-semibold text-slate-200">
            Tenure Guidance (Unofficial)
          </div>
          <div className="text-slate-400">
            Max age at maturity assumed at {maxAgeAtMaturity}.{" "}
            {suggestedMaxTenure !== null ? (
              <>
                With current age {ageNumber || "—"}, suggested max tenure is{" "}
                <span className="font-semibold">
                  {suggestedMaxTenure} year
                  {suggestedMaxTenure > 1 ? "s" : ""}
                </span>
                .
              </>
            ) : (
              "Enter age to view suggested tenure."
            )}
          </div>
        </div>
        <div>
          <div className="font-semibold text-slate-200">Tax Profile Hint</div>
          <div className="text-slate-400">
            More children usually means higher PCB relief and slightly higher
            net income recognition. Exact tax is still based on official LHDN
            tables.
          </div>
        </div>
        <div>
          <div className="font-semibold text-slate-200">
            LTV Policy Hint (Informal)
          </div>
          <div className="text-slate-400">
            Residents often qualify for higher LTV on first home (up to 90–95%
            under some schemes). Non-residents are usually capped lower and may
            need higher equity.
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AdvancedKYC;
