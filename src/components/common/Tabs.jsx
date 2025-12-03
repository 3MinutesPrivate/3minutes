import React from "react";

function Tabs({ tabs, activeId, onChange, className = "" }) {
  return (
    <div
      className={`inline-flex items-center rounded-lg bg-slate-900/80 p-1 border border-slate-800/80 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative mx-0.5 flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition
            ${
              isActive
                ? "bg-emerald-500 text-slate-900 shadow-sm"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
