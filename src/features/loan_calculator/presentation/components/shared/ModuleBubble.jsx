import React from "react";
import Card from "../../../../../components/common/Card.jsx";

/**
 * ModuleBubble
 *
 * - 默认 collapsed（defaultExpanded = false）
 * - collapsed: 显示为渐变圆形/胶囊按钮（大泡泡）
 * - expanded : 显示为 Card，内部渲染 children，并在底部提供 Collapse 按钮
 */
function ModuleBubble({
  id,
  label,
  subtitle,
  icon,
  defaultExpanded = false,
  onExpandChange,
  children,
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const open = () => {
    if (!expanded) {
      setExpanded(true);
      onExpandChange && onExpandChange(true);
    }
  };

  const close = () => {
    if (expanded) {
      setExpanded(false);
      onExpandChange && onExpandChange(false);
    }
  };

  if (!expanded) {
    // 收起状态：大泡泡按钮
    return (
      <button
        type="button"
        onClick={open}
        className="inline-flex items-center gap-2 rounded-full
                   bg-gradient-to-r from-emerald-400 via-amber-400 to-violet-500
                   px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg
                   hover:scale-105 active:scale-95 transition-transform"
        aria-expanded="false"
        aria-label={label}
        data-module-id={id}
      >
        {icon && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/20">
            {icon}
          </span>
        )}
        <span>{label}</span>
      </button>
    );
  }

  // 展开状态：Card 包裹 children + Collapse
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          {icon && (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-base">
              {icon}
            </span>
          )}
          <span>{label}</span>
        </div>
      }
      subtitle={subtitle}
      highlight
      className="relative"
    >
      <div className="space-y-3">
        <div>{children}</div>
        <div className="pt-2 border-t border-slate-800/80 flex justify-end">
          <button
            type="button"
            onClick={close}
            className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:bg-slate-700"
          >
            Collapse
          </button>
        </div>
      </div>
    </Card>
  );
}

export default ModuleBubble;
