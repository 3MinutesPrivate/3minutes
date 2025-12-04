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

  const agentModules = (layoutConfig.lensModules?.agent || []).filter(
    (m) => m.enabled !== false
  );
  const sortedModules = [...agentModules].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
  const getBubbleCfg = (id) =>
    sortedModules.find((m) => m.id === id)?.bubble || null;

  const bubbleSnap = getBubbleCfg("agent-snapquote");
  const bubbleDsr = getBubbleCfg("agent-dsr");
  const bubbleHelpers = getBubbleCfg("agent-helpers");

  return (
    <div className="space-y-4">
      {/* Snap Quote 泡泡 */}
      {bubbleSnap && (
        <ModuleBubble
          id="agent-snapquote"
          label={bubbleSnap.label || "Snap Quote"}
          subtitle={
            bubbleSnap.subtitle || "One-swipe quotation for fast closing."
          }
          icon={bubbleSnap.icon || "⚡"}
          defaultExpanded={bubbleSnap.defaultExpanded ?? false}
        >
          <Card
            title="Snap Quote"
            subtitle="Property price, margin, rate & tenure with estimated instalment."
          >
            <SnapQuote onQuoteChange={setQuoteSummary} />
          </Card>
        </ModuleBubble>
      )}

      {/* DSR 泡泡 */}
      {bubbleDsr && (
        <ModuleBubble
          id="agent-dsr"
          label={bubbleDsr.label || "DSR Check"}
          subtitle={bubbleDsr.subtitle || "Traffic light DSR pre-screen."}
          icon={bubbleDsr.icon || "🚦"}
          defaultExpanded={bubbleDsr.defaultExpanded ?? false}
        >
          <Card
            title="Traffic Light DSR Check"
            subtitle="Quick pre-screen before submitting the case."
          >
            <TrafficLight linkedLoan={quoteSummary} />
          </Card>
        </ModuleBubble>
      )}

      {/* Helper Tools 泡泡（包含 DefenseShield + HelperTools） */}
      {bubbleHelpers && (
        <ModuleBubble
          id="agent-helpers"
          label={bubbleHelpers.label || "Helper Tools"}
          subtitle={
            bubbleHelpers.subtitle ||
            "Smart checklist, reverse calculator & defense points."
          }
          icon={bubbleHelpers.icon || "🧰"}
          defaultExpanded={bubbleHelpers.defaultExpanded ?? false}
        >
          <Card
            title="Defense Shield"
            subtitle="Position your project against competing launches."
          >
            <DefenseShield />
          </Card>

          <Card
            title="Smart Checklist & Reverse Calculator"
            subtitle="Prepare documents and sense-check budget vs price."
          >
            <HelperTools />
          </Card>
        </ModuleBubble>
      )}
    </div>
  );
}

export default AgentView;
