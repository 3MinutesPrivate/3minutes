import React from "react";

function Slider({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  helperText,
  formatValue,
  className = "",
}) {
  const handleChange = (e) => {
    const next = parseFloat(e.target.value);
    if (Number.isNaN(next)) return;
    onChange(next);
  };

  const displayValue =
    typeof formatValue === "function" ? formatValue(value) : value;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs text-slate-200">
          <label htmlFor={id} className="font-medium">
            {label}
          </label>
          <span className="ml-2 text-[11px] text-emerald-400">
            {displayValue}
          </span>
        </div>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? 0}
        disabled={disabled}
        onChange={handleChange}
        className="w-full accent-emerald-500 disabled:opacity-50"
      />
      {helperText && (
        <p className="mt-1 text-[11px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

export default Slider;
