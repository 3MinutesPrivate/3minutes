import React from "react";

/**
 * FabLensSwitcher
 *
 * 右下角浮动按钮，用于在 Customer / Agent / Banker 视角之间切换。
 *
 * Props:
 *  - activeLens: string
 *  - options: [{ id, label, description }]
 *  - onChange: (id) => void
 */
function FabLensSwitcher({ activeLens, options, onChange }) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (id) => {
    if (id === activeLens) {
      setOpen(false);
      return;
    }
    onChange && onChange(id);
    setOpen(false);
  };

  if (!Array.isArray(options) || options.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* 展开的面板 */}
      {open && (
        <div className="mb-3 rounded-2xl border border-slate-800/80 bg-slate-950/95 px-3 py-2 shadow-xl">
          <div className="mb-1 text-[11px] font-semibold text-slate-300">
            Switch Perspective
          </div>
          <div className="space-y-1.5">
            {options.map((opt) => {
              const active = opt.id === activeLens;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={`flex w-full items-start gap-2 rounded-xl px-2 py-1.5 text-left text-[11px] transition ${
                    active
                      ? "bg-emerald-500 text-slate-900 shadow"
                      : "bg-slate-900/80 text-slate-200 hover:bg-slate-800/80"
                  }`}
                >
                  <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[9px]">
                    {opt.label[0] || "?"}
                  </span>
                  <span>
                    <span className="block text-[11px] font-semibold">
                      {opt.label}
                    </span>
                    {opt.description && (
                      <span className="text-[10px] text-slate-400">
                        {opt.description}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 主 FAB 按钮 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-amber-400 to-violet-500 text-slate-900 shadow-xl shadow-violet-500/40 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400/80 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        {open ? "×" : "👁"}
      </button>
    </div>
  );
}

export default FabLensSwitcher;
