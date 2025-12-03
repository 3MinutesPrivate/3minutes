import React from "react";

function Card({
  title,
  subtitle,
  children,
  footer,
  className = "",
  highlight = false,
  onClick,
  padded = true,
}) {
  const clickable = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden
        rounded-2xl border bg-slate-950/80 text-slate-100
        shadow-lg transition
        border-slate-800/80
        ${highlight ? "border-violetBrand/80 shadow-violet-500/40 shadow-[0_0_25px_rgba(139,92,246,0.55)]" : ""}
        ${clickable ? "cursor-pointer hover:border-violetBrand hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]" : ""}
        ${className}
      `}
    >
      {/* 顶部细渐变条，模仿 Finzo 卡片上的光带 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violetBrand/60 via-amberBrand/60 to-limeBrand/60" />

      {(title || subtitle) && (
        <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-slate-50 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {children && (
        <div className={padded ? "px-4 pb-4 pt-2 space-y-3" : ""}>
          {children}
        </div>
      )}

      {footer && (
        <div className="px-4 py-3 border-t border-slate-800/80 text-xs text-slate-300 flex items-center justify-between gap-2">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
