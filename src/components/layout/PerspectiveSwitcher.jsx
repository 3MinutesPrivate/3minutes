import React from "react";
import { useAppContext } from "../../context/AppContext.jsx";

const MODES = [
  { id: "customer", label: "Customer" },
  { id: "agent", label: "Agent" },
  { id: "banker", label: "Banker" },
];

/**
 * 顶部模式指示器（只负责显示当前 Lens，不再可点击切换）
 * - 当前模式按钮“亮灯”：绿色背景 + 小灯泡图标
 * - 真正的切换由右下角 FAB 完成（UnifiedCalculator 会同步 mode）
 */
function PerspectiveSwitcher() {
  const { mode } = useAppContext();

  return (
    <div className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/80 p-0.5 text-[11px]">
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            disabled
            className={`mx-0.5 rounded-full px-2.5 py-1 flex items-center gap-1 transition ${
              active
                ? "bg-emerald-500 text-slate-900 shadow-sm"
                : "text-slate-300"
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
