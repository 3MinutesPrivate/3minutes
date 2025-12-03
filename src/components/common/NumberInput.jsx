import React from "react";

function NumberInput({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  min,
  max,
  step = "any",
  disabled = false,
  error,
  helperText,
  className = "",
}) {
  const handleChange = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange("");
      return;
    }
    const sanitized = raw.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(sanitized);
    if (Number.isNaN(parsed)) {
      onChange("");
    } else {
      if (typeof min === "number" && parsed < min) {
        onChange(min);
        return;
      }
      if (typeof max === "number" && parsed > max) {
        onChange(max);
        return;
      }
      onChange(parsed);
    }
  };

  const displayValue =
    value === null || typeof value === "undefined" ? "" : String(value);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 flex items-center justify-between text-xs font-medium text-slate-200"
        >
          <span>{label}</span>
        </label>
      )}
      <div
        className={`flex items-stretch rounded-lg border bg-slate-900/80 text-slate-50
        ${error ? "border-crimson-500/80" : "border-slate-700/80 focus-within:border-emerald-400/90"}
        focus-within:ring-1 focus-within:ring-emerald-500/60 transition`}
      >
        {prefix && (
          <span className="flex items-center px-2 text-xs text-slate-400 border-r border-slate-800/80">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
        {suffix && (
          <span className="flex items-center px-2 text-xs text-slate-400 border-l border-slate-800/80">
            {suffix}
          </span>
        )}
      </div>
      {(helperText || error) && (
        <p
          className={`mt-1 text-[11px] ${
            error ? "text-crimson-400" : "text-slate-400"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export default NumberInput;
