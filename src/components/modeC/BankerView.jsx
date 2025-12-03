import React from "react";
import AdvancedKYC from "./AdvancedKYC";
import IncomeRecognition from "./IncomeRecognition";
import CommitmentStack from "./CommitmentStack";
import HandbookSettings from "./HandbookSettings";
import SimulationMitigation from "./SimulationMitigation";
import WatermarkOverlay from "../layout/WatermarkOverlay";
import Card from "../common/Card";

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
