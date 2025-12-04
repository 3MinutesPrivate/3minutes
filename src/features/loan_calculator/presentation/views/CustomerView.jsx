import React from "react";
import layoutConfig from "../../../../data/layout-config.json";
import ModuleBubble from "../components/shared/ModuleBubble.jsx";
import Card from "../../../../components/common/Card.jsx";
import InputsPanel from "../components/customer/InputsPanel.jsx";
import SummaryCards from "../components/customer/SummaryCards.jsx";
import AmortizationTable from "../components/customer/AmortizationTable.jsx";
import ChartsPanel from "../components/customer/ChartsPanel.jsx";
import FlexiSimulator from "../components/customer/FlexiSimulator.jsx";

function CustomerView() {
  const [calcState, setCalcState] = React.useState(null);

  const handleCalcChange = (state) => {
    setCalcState(state);
  };

  const customerModules = (layoutConfig.lensModules?.customer || []).filter(
    (m) => m.enabled !== false
  );

  const sortedModules = [...customerModules].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const getBubbleCfg = (id) =>
    sortedModules.find((m) => m.id === id)?.bubble || null;

  const bubbleCalc = getBubbleCfg("cust-calculator");
  const bubbleSummary = getBubbleCfg("cust-summary");
  const bubbleTable = getBubbleCfg("cust-table");
  const bubbleFlexi = getBubbleCfg("cust-flexi");

  return (
    <div className="space-y-4">
      {/* Calculator 泡泡 */}
      {bubbleCalc && (
        <ModuleBubble
          id="cust-calculator"
          label={bubbleCalc.label || "Calculator"}
          subtitle={
            bubbleCalc.subtitle || "Input & configure your home financing."
          }
          icon={bubbleCalc.icon || "🧮"}
          defaultExpanded={bubbleCalc.defaultExpanded ?? false}
        >
          <Card
            title="Calculator"
            subtitle="Property value, downpayment, loan amount, rate and tenure."
          >
            <InputsPanel onStateChange={handleCalcChange} />
          </Card>
        </ModuleBubble>
      )}

      {/* Summary 泡泡 */}
      {bubbleSummary && (
        <ModuleBubble
          id="cust-summary"
          label={bubbleSummary.label || "Summary"}
          subtitle={
            bubbleSummary.subtitle || "Key numbers and payoff date overview."
          }
          icon={bubbleSummary.icon || "📌"}
          defaultExpanded={bubbleSummary.defaultExpanded ?? false}
        >
          {calcState ? (
            <Card
              title="Loan Summary"
              subtitle="Monthly repayment, total interest and payoff date."
            >
              <SummaryCards calcState={calcState} />
            </Card>
          ) : (
            <Card
              title="Loan Summary"
              subtitle="Run the calculator bubble first to see the summary."
            >
              <p className="text-xs text-slate-400">
                Please fill in the Calculator bubble before viewing the
                summary.
              </p>
            </Card>
          )}
        </ModuleBubble>
      )}

      {/* Table 泡泡（表 + 图可放一起） */}
      {bubbleTable && (
        <ModuleBubble
          id="cust-table"
          label={bubbleTable.label || "Table"}
          subtitle={bubbleTable.subtitle || "Monthly & annual breakdown."}
          icon={bubbleTable.icon || "📑"}
          defaultExpanded={bubbleTable.defaultExpanded ?? false}
        >
          {calcState ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card
                title="Amortization Table"
                subtitle="Payment, principal, interest and balance."
              >
                <AmortizationTable calcState={calcState} />
              </Card>
              <Card
                title="Visual Breakdown"
                subtitle="Outstanding balance vs cumulative interest."
              >
                <ChartsPanel calcState={calcState} />
              </Card>
            </div>
          ) : (
            <Card
              title="Amortization & Charts"
              subtitle="Run the calculator bubble first to see the breakdown."
            >
              <p className="text-xs text-slate-400">
                Please fill in the Calculator bubble before viewing tables and
                charts.
              </p>
            </Card>
          )}
        </ModuleBubble>
      )}

      {/* Simulator 泡泡 */}
      {bubbleFlexi && (
        <ModuleBubble
          id="cust-flexi"
          label={bubbleFlexi.label || "Simulator"}
          subtitle={
            bubbleFlexi.subtitle ||
            "See how flexi structure and advance payments save interest."
          }
          icon={bubbleFlexi.icon || "📈"}
          defaultExpanded={bubbleFlexi.defaultExpanded ?? false}
        >
          {calcState ? (
            <Card
              title="Flexi Simulator"
              subtitle="Visualise interest savings with flexi structures."
            >
              <FlexiSimulator baseCalcState={calcState} />
            </Card>
          ) : (
            <Card
              title="Flexi Simulator"
              subtitle="Run the calculator bubble first to set a base loan."
            >
              <p className="text-xs text-slate-400">
                Please fill in the Calculator bubble before running the flexi
                simulation.
              </p>
            </Card>
          )}
        </ModuleBubble>
      )}
    </div>
  );
}

export default CustomerView;
