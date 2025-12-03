import React from "react";

function Tooltip({ content, children, className = "" }) {
  return (
    <span className={`relative inline-flex group ${className}`}>
      {children}
      <span
        className="pointer-events-none absolute z-30 left-1/2 top-full mt-1.5 w-max max-w-xs -translate-x-1/2
        scale-95 rounded-md bg-slate-900 px-2 py-1 text-[10px] text-slate-100 opacity-0 shadow-lg
        ring-1 ring-slate-800 transition-all group-hover:opacity-100 group-hover:scale-100"
      >
        {content}
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900 ring-1 ring-slate-800" />
      </span>
    </span>
  );
}

export default Tooltip;
