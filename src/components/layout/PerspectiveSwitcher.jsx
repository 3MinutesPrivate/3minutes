import React from "react";
import { useAppContext } from "../../context/AppContext.jsx";

const MODES = [
  { id: "customer", label: "Customer" },
  { id: "agent", label: "Agent" },
  { id: "banker", label: "Banker" },
];

/**
 * 顶部模式切换器，用于显示当前 Lens，并允许用户切换。
 * - 当前模式按钮“亮灯”：绿色背景 + 小灯泡图标
 * - 点击会更新 AppContext.mode，UnifiedCalculator 会同步 activeLens
 */
function PerspectiveSwitcher() {
  const { mode, setMode } = useAppContext();

  return (
    <div className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/80 p-0.5 text-[11px]">
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`mx-0.5 rounded-full px-2.5 py-1 flex items-center gap-1 transition ${
              active
                ? "bg-emerald-500 text-slate-900 shadow-sm"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-50"
            }`}
          >
            {active && (
              <span className="text-[10px]" aria-hidden="true">
                💡
              </span>
            )}
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default PerspectiveSwitcher;
