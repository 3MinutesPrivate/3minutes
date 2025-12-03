import React from "react";

function Toggle({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = "",
}) {
  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <button
      type="button"
      id={id}
      onClick={handleClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left
      transition bg-slate-900/80 border-slate-700/80
      ${checked ? "border-emerald-500/80 ring-1 ring-emerald-500/40" : ""}
      ${disabled ? "opacity-60 cursor-not-allowed" : "hover:border-emerald-400/90"}
      ${className}`}
      aria-pressed={checked}
    >
      <span
        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full
        transition-colors ${checked ? "bg-emerald-500" : "bg-slate-600"}`}
      >
        <span
          className={`absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform
          ${checked ? "translate-x-4" : "translate-x-0"}`}
        />
      </span>
      <span className="flex flex-col">
        {label && (
          <span className="text-xs font-medium text-slate-100">{label}</span>
        )}
        {description && (
          <span className="mt-0.5 text-[11px] text-slate-400">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}

export default Toggle;
