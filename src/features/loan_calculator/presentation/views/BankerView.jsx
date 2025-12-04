import React from "react";
import layoutConfig from "../../../../data/layout-config.json";
import ModuleBubble from "../components/shared/ModuleBubble.jsx";
import AdvancedKYC from "../components/banker/AdvancedKYC.jsx";
import IncomeRecognition from "../components/banker/IncomeRecognition.jsx";
import CommitmentStack from "../components/banker/CommitmentStack.jsx";
import HandbookSettings from "../components/banker/HandbookSettings.jsx";
import SimulationMitigation from "../components/banker/SimulationMitigation.jsx";
import WatermarkOverlay from "../../../../components/layout/WatermarkOverlay.jsx";
import Card from "../../../../components/common/Card.jsx";

function BankerView() {
  const [kyc, setKyc] = React.useState({
    age: "",
    maritalStatus: "single",
    children: 0,
    residentStatus: "resident",
  });

  const [incomeSummary, setIncomeSummary] = React.useState(null);
  const [commitmentResult, setCommitmentResult] = React.useState(null);

  const bankerModules = layoutConfig.lensModules?.banker || [];
  const enabledBankerModules = bankerModules
    .filter((m) => m.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const findCfg = (id) =>
    enabledBankerModules.find((m) => m.id === id) || null;

  const cfgKyc = findCfg("banker-kyc");
  const cfgIncome = findCfg("banker-income");
  const cfgCommit = findCfg("banker-commit");
  const cfgHandbook = findCfg("banker-handbook");
  const cfgSim = findCfg("banker-sim");

  return (
    <WatermarkOverlay>
      <div className="space-y-4">
        <Card
          title="Credit Cockpit"
          subtitle="Designed for bankers and senior agents who live in policy, DSR and mitigation."
        >
          <p className="text-xs text-slate-400">
            Use this view for deeper credit assessment, income recognition and
            rescue strategies. Calculations are for reference only and subject
            to final bank approval.
          </p>
        </Card>

        {cfgKyc && (
          <ModuleBubble
            id={cfgKyc.id}
            label={cfgKyc.bubble?.label || "KYC"}
            subtitle={
              cfgKyc.bubble?.subtitle ||
              "Age, family profile and residency drive policy, LTV and tax logic."
            }
            icon={cfgKyc.bubble?.icon || "🧾"}
            defaultExpanded={cfgKyc.bubble?.defaultExpanded ?? false}
          >
            <AdvancedKYC value={kyc} onChange={setKyc} />
          </ModuleBubble>
        )}

        {cfgIncome && (
          <ModuleBubble
            id={cfgIncome.id}
            label={cfgIncome.bubble?.label || "Income Engine"}
            subtitle={
              cfgIncome.bubble?.subtitle ||
              "Matrix view of raw income, statutory deductions and recognised income."
            }
            icon={cfgIncome.bubble?.icon || "📊"}
            defaultExpanded={cfgIncome.bubble?.defaultExpanded ?? false}
          >
            <IncomeRecognition
              kyc={kyc}
              onIncomeSummaryChange={setIncomeSummary}
            />
          </ModuleBubble>
        )}

        {cfgCommit && (
          <ModuleBubble
            id={cfgCommit.id}
            label={cfgCommit.bubble?.label || "Commitment Stack"}
            subtitle={
              cfgCommit.bubble?.subtitle ||
              "All bank and hidden debts with DSR and cost-of-living checks."
            }
            icon={cfgCommit.bubble?.icon || "📚"}
            defaultExpanded={cfgCommit.bubble?.defaultExpanded ?? false}
          >
            <CommitmentStack
              incomeSummary={incomeSummary}
              onResultChange={setCommitmentResult}
            />
          </ModuleBubble>
        )}

        {cfgHandbook && (
          <ModuleBubble
            id={cfgHandbook.id}
            label={cfgHandbook.bubble?.label || "Handbook"}
            subtitle={
              cfgHandbook.bubble?.subtitle ||
              "Central parameters for tenure, income haircuts and DSR strategies."
            }
            icon={cfgHandbook.bubble?.icon || "⚙️"}
            defaultExpanded={cfgHandbook.bubble?.defaultExpanded ?? false}
          >
            <HandbookSettings />
          </ModuleBubble>
        )}

        {cfgSim && (
          <ModuleBubble
            id={cfgSim.id}
            label={cfgSim.bubble?.label || "Rescue Engine"}
            subtitle={
              cfgSim.bubble?.subtitle ||
              "Simulation & mitigation for borderline or failing cases."
            }
            icon={cfgSim.bubble?.icon || "🩺"}
            defaultExpanded={cfgSim.bubble?.defaultExpanded ?? false}
          >
            {/* SimulationMitigation 自己根据 status (GREEN/YELLOW/RED/FAIL_COST) 决定是否显示内容 */}
            <SimulationMitigation
              incomeSummary={incomeSummary}
              commitmentResult={commitmentResult}
            />
          </ModuleBubble>
        )}
      </div>
    </WatermarkOverlay>
  );
}

export default BankerView;
