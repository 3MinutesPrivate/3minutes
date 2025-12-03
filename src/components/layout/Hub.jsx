import React from "react";
import Card from "../common/Card";
import { useAppContext } from "../../context/AppContext.jsx";
import { useHiveMindDefaults } from "../../hooks/useHiveMindDefaults.js";
import { formatPercent } from "../../utils/formatters.js";

function Hub() {
  const { mode, setMode } = useAppContext();
  const { defaults } = useHiveMindDefaults();

  const perspectiveLabel =
    mode === "customer" ? "Customer" : mode === "agent" ? "Agent" : "Banker";

  return (
    <section className="space-y-3">
      <p className="text-xs text-slate-400">
        You are viewing the{" "}
        <span className="font-semibold text-emerald-400">
          {perspectiveLabel}
        </span>{" "}
        perspective. Switch anytime from the top-right.
      </p>

      <div className="grid gap-4 md:grid-cols-4">
        {/* 3M Calculator */}
        <Card
          title="3M Calculator"
          subtitle="End-to-end loan visualisation for customers."
          highlight={mode === "customer"}
          onClick={() => setMode("customer")}
        >
          <div className="flex items-start gap-3 text-[11px] text-slate-300">
            <div className="mt-0.5 h-7 w-7 flex items-center justify-center rounded-full
                            bg-violetBrand/30 text-white text-xs shadow-inner">
              🧮
            </div>
            <p>
              Show property price, downpayment, instalment and full
              amortisation schedule in one flow.
            </p>
          </div>
        </Card>

        {/* DSR Check */}
        <Card
          title="DSR Check"
          subtitle="Snap Quote + Traffic Light for agents."
          highlight={mode === "agent"}
          onClick={() => setMode("agent")}
        >
          <div className="flex items-start gap-3 text-[11px] text-slate-300">
            <div className="mt-0.5 h-7 w-7 flex items-center justify-center rounded-full
                            bg-emerald-500/25 text-emerald-100 text-xs shadow-inner">
              🚦
            </div>
            <p>
              Combine quick quotation, entry costs and instant DSR traffic
              light to pre-screen buyers.
            </p>
          </div>
        </Card>

        {/* Document List */}
        <Card
          title="Document List"
          subtitle="Smart checklist by customer persona."
          onClick={() => setMode("agent")}
        >
          <div className="flex items-start gap-3 text-[11px] text-slate-300">
            <div className="mt-0.5 h-7 w-7 flex items-center justify-center rounded-full
                            bg-amberBrand/25 text-amberBrand text-xs shadow-inner">
              📄
            </div>
            <p>
              Use the Helper Tools module (Agent View) to avoid missing
              income, tax and supporting documents at submission.
            </p>
          </div>
        </Card>

        {/* Community Rates */}
        <Card
          title="Community Rates"
          subtitle="Hive Mind default interest."
        >
          <div className="flex items-start gap-3 text-[11px] text-slate-300">
            <div className="mt-0.5 h-7 w-7 flex items-center justify-center rounded-full
                            bg-limeBrand/25 text-limeBrand text-xs shadow-inner">
              📈
            </div>
            <div>
              <p>
                Current default home loan rate:{" "}
                <span className="font-semibold text-emerald-400">
                  {formatPercent(defaults.interestRate || 4.1)}
                </span>{" "}
                p.a. Based on SBR + spread and recent user inputs.
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                This is a crowd-sourced reference only. Final bank rate
                depends on product, tenure and profile.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default Hub;
