import React from "react";
import Card from "../common/Card";
import InputsPanel from "./InputsPanel";
import SummaryCards from "./SummaryCards";
import AmortizationTable from "./AmortizationTable";
import ChartsPanel from "./ChartsPanel";
import FlexiSimulator from "./FlexiSimulator";

function CustomerView() {
  const [calcState, setCalcState] = React.useState(null);

  const handleCalcChange = (state) => {
    setCalcState(state);
  };

  return (
    <div className="space-y-4">
      <Card
        title="3M Calculator"
        subtitle="Understand your home loan in 3 minutes. Simple, precise, visual."
      >
        <InputsPanel onStateChange={handleCalcChange} />
      </Card>

      {calcState && (
        <>
          <SummaryCards calcState={calcState} />
          <div className="grid gap-4 md:grid-cols-2">
            <AmortizationTable calcState={calcState} />
            <ChartsPanel calcState={calcState} />
          </div>
        </>
      )}

      <FlexiSimulator baseCalcState={calcState} />
    </div>
  );
}

export default CustomerView;
