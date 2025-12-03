import React from "react";
import SnapQuote from "./SnapQuote";
import TrafficLight from "./TrafficLight";
import DefenseShield from "./DefenseShield";
import HelperTools from "./HelperTools";

function AgentView() {
  const [quoteSummary, setQuoteSummary] = React.useState(null);

  return (
    <div className="space-y-4">
      <SnapQuote onQuoteChange={setQuoteSummary} />
      <TrafficLight linkedLoan={quoteSummary} />
      <DefenseShield />
      <HelperTools />
    </div>
  );
}

export default AgentView;
