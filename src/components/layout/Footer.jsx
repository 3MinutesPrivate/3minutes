import React from "react";

/**
 * Footer
 *
 * 法务与 PDPA 文案：
 * - 文案内容不可删减或通过配置修改
 * - 视觉上尽量低调：较小字号、浅颜色，避免占据过多视觉焦点
 */
function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-800/80 bg-slate-950/95">
      <div className="mx-auto max-w-6xl px-4 py-3 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-4 text-[10px] text-slate-400">
          <div className="space-y-0.5">
            <div className="font-semibold text-slate-200 text-[10px]">
              3Minutes Fintech
            </div>
            <div className="leading-snug">
              Level 12, Midtown Co-Working, Jalan Tun Razak, 50400 Kuala Lumpur
            </div>
            <div className="leading-snug">Landline: +603-2710 0000</div>
            <div className="leading-snug">Email: support@3minutes.com</div>
          </div>

          <div className="max-w-md space-y-1 text-[9px] text-slate-500 leading-snug">
            <div className="font-semibold text-slate-300">
              Disclaimer
            </div>
            <p>
              All calculations and simulations are for reference only and are
              subject to final bank approval and official product terms.
              3Minutes is a fintech tool, not a bank, and does not provide
              guaranteed approval or credit decisions.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4 pt-2 border-t border-slate-800/80 text-[9px] leading-snug">
          <p className="text-slate-500 max-w-xl">
            <span className="font-semibold text-slate-300">
              PDPA Notice:
            </span>{" "}
            Data collected in this tool is used for assessment and illustration
            purposes only. We adhere to PDPA standards and do not sell personal
            data to third parties.
          </p>
          <p className="text-right text-slate-600 max-w-xs">
            <span className="font-semibold text-slate-300">
              Vocabulary policy:
            </span>{" "}
            we use terms like{" "}
            <span className="font-semibold">“high approval probability”</span>{" "}
            and <span className="font-semibold">“max margin financing”</span>{" "}
            instead of absolute promises.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
