import React from "react";
import SnapQuote from "../components/agent/SnapQuote.jsx";
import TrafficLight from "../components/agent/TrafficLight.jsx";
import DefenseShield from "../components/agent/DefenseShield.jsx";
import HelperTools from "../components/agent/HelperTools.jsx";

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
