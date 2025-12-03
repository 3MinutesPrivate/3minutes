import React from "react";
import Card from "../common/Card";
import { useAppContext } from "../../context/AppContext";
import { useHiveMindDefaults } from "../../hooks/useHiveMindDefaults";
import { formatPercent } from "../../utils/formatters";

function Hub() {
  const { mode, setMode } = useAppContext();
  const { defaults } = useHiveMindDefaults();

  return (
    <section className="mx-auto mt-4 max-w-6xl px-4">
      <div className="mb-3 text-xs text-slate-400">
        You are viewing the{" "}
        <span className="font-semibold text-emerald-400">
          {mode === "customer"
            ? "Customer"
            : mode === "agent"
            ? "Agent"
            : "Banker"}
        </span>{" "}
        perspective. Switch anytime from the top-right.
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card
          title="3M Calculator"
          subtitle="End-to-end loan visualisation for customers."
          highlight={mode === "customer"}
          onClick={() => setMode("customer")}
        >
          <p className="text-[11px] text-slate-400">
            Show property price, downpayment, instalment and full amortisation
            schedule in one flow.
          </p>
        </Card>

        <Card
          title="DSR Check"
          subtitle="Snap Quote + Traffic Light for agents."
          highlight={mode === "agent"}
          onClick={() => setMode("agent")}
        >
          <p className="text-[11px] text-slate-400">
            Combine quick quotation, entry costs and instant DSR traffic light
            to pre-screen buyers.
          </p>
        </Card>

        <Card
          title="Document List"
          subtitle="Smart checklist by customer persona."
          onClick={() => setMode("agent")}
        >
          <p className="text-[11px] text-slate-400">
            Use the Helper Tools module (Agent View) to avoid missing income,
            tax and supporting documents at submission.
          </p>
        </Card>

        <Card
          title="Community Rates"
          subtitle="Hive Mind default interest."
        >
          <p className="text-[11px] text-slate-400">
            Current default home loan rate:{" "}
            <span className="font-semibold text-emerald-400">
              {formatPercent((defaults.interestRate || 4.1))}
            </span>{" "}
            p.a. Based on SBR + spread and recent user inputs.
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            This is a crowd-sourced reference only. Final bank rate depends on
            product, tenure and profile.
          </p>
        </Card>
      </div>
    </section>
  );
}

export default Hub;
