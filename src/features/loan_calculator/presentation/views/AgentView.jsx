import React from "react";
import layoutConfig from "../../../../data/layout-config.json";
import ModuleBubble from "../components/shared/ModuleBubble.jsx";
import Card from "../../../../components/common/Card.jsx";
import SnapQuote from "../components/agent/SnapQuote.jsx";
import TrafficLight from "../components/agent/TrafficLight.jsx";
import DefenseShield from "../components/agent/DefenseShield.jsx";
import HelperTools from "../components/agent/HelperTools.jsx";

function AgentView() {
  const [quoteSummary, setQuoteSummary] = React.useState(null);

  const agentModules = layoutConfig.lensModules?.agent || [];
  const cfg = agentModules
    .filter((m) => m.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .find((m) => m.id === "agent-tools");

  if (!cfg) {
    return null;
  }

  const bubble = cfg.bubble || {};

  return (
    <div className="space-y-4">
      <ModuleBubble
        id={cfg.id}
        label={bubble.label || "Agent Tools"}
        subtitle={
          bubble.subtitle || "Snap Quote, DSR check, defense & helper tools."
        }
        icon={bubble.icon || "🧰"}
        defaultExpanded={bubble.defaultExpanded ?? false}
      >
        <Card
          title="Snap Quote"
          subtitle="One-swipe quotation for fast closing."
        >
          <SnapQuote onQuoteChange={setQuoteSummary} />
        </Card>

        <Card
          title="Traffic Light DSR Check"
          subtitle="Quick pre-screen before submitting."
        >
          <TrafficLight linkedLoan={quoteSummary} />
        </Card>

        <Card
          title="Defense Shield"
          subtitle="Position your project against competing launches."
        >
          <DefenseShield />
        </Card>

        <Card
          title="Helper Tools"
          subtitle="Smart checklist & reverse calculator."
        >
          <HelperTools />
        </Card>
      </ModuleBubble>
    </div>
  );
}

export default AgentView;
