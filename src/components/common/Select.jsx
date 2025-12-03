import React from "react";

function Select({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  helperText,
  className = "",
}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-xs font-medium text-slate-200"
        >
          {label}
        </label>
      )}
      <div
        className={`relative rounded-lg border bg-slate-900/80
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        border-slate-700/80 focus-within:border-emerald-400/90 focus-within:ring-1 focus-within:ring-emerald-500/60 transition`}
      >
        <select
          id={id}
          value={value ?? ""}
          disabled={disabled}
          onChange={handleChange}
          className="w-full appearance-none bg-transparent px-3 py-2 text-sm text-slate-50 outline-none"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {Array.isArray(options) &&
            options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-slate-900 text-slate-100"
              >
                {opt.label}
              </option>
            ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400">
          ▼
        </span>
      </div>
      {helperText && (
        <p className="mt-1 text-[11px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

export default Select;
