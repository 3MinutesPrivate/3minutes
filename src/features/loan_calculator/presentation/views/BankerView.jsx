import React from "react";
import AdvancedKYC from "../components/banker/AdvancedKYC.jsx";
import IncomeRecognition from "../components/banker/IncomeRecognition.jsx";
import CommitmentStack from "../components/banker/CommitmentStack.jsx";
import HandbookSettings from "../components/banker/HandbookSettings.jsx";
import SimulationMitigation from "../components/banker/SimulationMitigation.jsx";
import WatermarkOverlay from "../../../../../components/layout/WatermarkOverlay.jsx";
import Card from "../../../../../components/common/Card.jsx";

function BankerView() {
  const [kyc, setKyc] = React.useState({
    age: "",
    maritalStatus: "single",
    children: 0,
    residentStatus: "resident",
  });

  const [incomeSummary, setIncomeSummary] = React.useState(null);
  const [commitmentResult, setCommitmentResult] = React.useState(null);

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

        <AdvancedKYC value={kyc} onChange={setKyc} />

        <IncomeRecognition
          kyc={kyc}
          onIncomeSummaryChange={setIncomeSummary}
        />

        <CommitmentStack
          incomeSummary={incomeSummary}
          onResultChange={setCommitmentResult}
        />

        <HandbookSettings />

        <SimulationMitigation
          incomeSummary={incomeSummary}
          commitmentResult={commitmentResult}
        />
      </div>
    </WatermarkOverlay>
  );
}

export default BankerView;
