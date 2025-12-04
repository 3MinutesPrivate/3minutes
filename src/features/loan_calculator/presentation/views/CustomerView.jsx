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

  const customerModules = layoutConfig.lensModules?.customer || [];
  const cfg = customerModules
    .filter((m) => m.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .find((m) => m.id === "cust-calculator");

  if (!cfg) {
    return null;
  }

  const bubble = cfg.bubble || {};

  return (
    <div className="space-y-4">
      <ModuleBubble
        id={cfg.id}
        label={bubble.label || "3M Calculator"}
        subtitle={
          bubble.subtitle ||
          "Understand your home loan in 3 minutes. Simple, precise, visual."
        }
        icon={bubble.icon || "🧮"}
        defaultExpanded={bubble.defaultExpanded ?? false}
      >
        {/* Section 1: Inputs */}
        <Card
          title="Base Inputs"
          subtitle="Property, loan amount, rates and start date."
        >
          <InputsPanel onStateChange={handleCalcChange} />
        </Card>

        {/* Section 2: Summary */}
        {calcState && (
          <Card
            title="Loan Summary"
            subtitle="Monthly repayment, total interest and payoff date."
          >
            <SummaryCards calcState={calcState} />
          </Card>
        )}

        {/* Section 3 & 4: Table + Charts */}
        {calcState && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card
              title="Amortization Table"
              subtitle="Monthly/annual breakdown of your loan."
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
        )}

        {/* Section 5: Flexi Simulator */}
        {calcState && (
          <Card
            title="Flexi Simulator"
            subtitle="See how flexi structure reduces interest."
          >
            <FlexiSimulator baseCalcState={calcState} />
          </Card>
        )}
      </ModuleBubble>
    </div>
  );
}

export default CustomerView;
