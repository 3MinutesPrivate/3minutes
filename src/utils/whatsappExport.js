// WhatsApp export helpers for different perspectives (Customer / Agent / Banker)
import { formatCurrency, formatPercent } from "./formatters.js";

/**
 * Agent View – Snap Quote template
 * payload from SnapQuote.jsx
 */
export function buildAgentQuoteMessage(payload) {
  const {
    agentName,
    agentPhone,
    price,
    rate,
    tenureYears,
    margin,
    loanAmount,
    netPrice,
    cashBack,
    installment,
    entryCosts,
  } = payload || {};

  const lines = [];

  lines.push("🏠 3Minutes Snap Quote");
  lines.push("────────────────────");
  lines.push(
    `Agent: ${agentName || "—"}${agentPhone ? `  📞 ${agentPhone}` : ""}`
  );
  lines.push("");

  lines.push(`Property Price: ${formatCurrency(price)}`);
  lines.push(
    `Rate & Tenure : ${formatPercent(
      rate || 0
    )} p.a.  •  ${tenureYears || "-"} years`
  );
  lines.push(`Margin        : ${formatPercent(margin || 0)}`);
  lines.push(`Loan Amount   : ${formatCurrency(loanAmount)}`);
  lines.push("");

  lines.push(
    `Developer Rebate: ${formatPercent(
      payload.rebatePercent || payload.rebate || 0
    )}`
  );
  lines.push(`Net Price       : ${formatCurrency(netPrice)}`);
  lines.push(
    `Est. Cash Back  : ${formatCurrency(
      cashBack
    )} (if loan > net price & subject to bank approval)`
  );
  lines.push("");

  lines.push(`Estimated Installment: ${formatCurrency(installment)} / month`);
  lines.push(
    "(Final figures may differ slightly after bank rounding & product structure.)"
  );

  if (entryCosts) {
    lines.push("");
    lines.push("Entry Costs (Est.):");
    lines.push(
      `• MOT Stamp Duty  : ${formatCurrency(entryCosts.motStampDuty || 0)}`
    );
    lines.push(
      `• Loan Stamp Duty : ${formatCurrency(entryCosts.loanStampDuty || 0)}`
    );
    lines.push(`• Legal Fees      : ${formatCurrency(entryCosts.legalFee || 0)}`);
    lines.push(
      `➡️ Total Entry Cost: ${formatCurrency(entryCosts.total || 0)}`
    );
  }

  lines.push("");
  lines.push(
    "Note: All calculations are for reference only and subject to final bank approval."
  );
  lines.push(
    "3Minutes is a fintech tool, not a bank. We talk about high approval probability, not guaranteed approval."
  );

  return lines.join("\n");
}

/**
 * (可选) Customer View 导出 – 目前组件没用到，先预留一个接口
 */
export function buildCustomerSummaryMessage(calcState) {
  if (!calcState) return "3Minutes – Customer Summary (no data).";

  const {
    propertyValue,
    downpaymentAmount,
    loanPrincipal,
    interestRate,
    tenureYears,
    installment,
  } = calcState;

  const lines = [];
  lines.push("🏠 3Minutes Home Loan Summary");
  lines.push("────────────────────────────");
  lines.push(`Property Value : ${formatCurrency(propertyValue)}`);
  lines.push(`Downpayment    : ${formatCurrency(downpaymentAmount)}`);
  lines.push(`Loan Principal : ${formatCurrency(loanPrincipal)}`);
  lines.push(
    `Rate & Tenure : ${formatPercent(
      interestRate
    )} p.a. • ${tenureYears} years`
  );
  lines.push(`Installment    : ${formatCurrency(installment)} / month`);
  lines.push("");
  lines.push(
    "All results are for reference only and subject to final bank approval."
  );
  return lines.join("\n");
}
