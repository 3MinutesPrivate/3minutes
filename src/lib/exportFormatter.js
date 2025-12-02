import { BRAND } from './constants.js';
import { roundUp } from './validation.js';

function formatCurrency(n) {
  const v = Number(n) || 0;
  return (
    'RM ' +
    v.toLocaleString('en-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  );
}

/**
 * WhatsApp export for main 3M Calculator (Customer View)
 */
export function formatCalculatorWhatsApp({
  userName,
  propertyValue,
  loanPrincipal,
  interestRate,
  tenureYears,
  installment,
  totalPayment,
  totalInterest,
  payoffDate
}) {
  return [
    `🏡 *${BRAND.name} – Mortgage Snapshot*`,
    ``,
    `👤 Customer: *${userName || '-'}*`,
    `🏷 Property Value: *${formatCurrency(propertyValue)}*`,
    `💰 Loan Principal: *${formatCurrency(loanPrincipal)}*`,
    `📉 Rate: *${roundUp(interestRate, 2)}%*`,
    `⏳ Tenure: *${tenureYears} years*`,
    ``,
    `💸 Estimated Installment: *${formatCurrency(installment)} / month*`,
    `📆 Payoff Date: *${payoffDate || '-'}*`,
    ``,
    `📊 Total Payment: *${formatCurrency(totalPayment)}*`,
    `💣 Total Interest: *${formatCurrency(totalInterest)}*`,
    ``,
    `⚠️ ${BRAND.name} Disclaimer:`,
    `All calculations are for reference only and subject to final bank approval. ${BRAND.name} is a fintech tool, not a bank.`
  ].join('\n');
}

/**
 * WhatsApp export for Agent Snap Quote
 */
export function formatSnapQuoteWhatsApp({
  agentName,
  projectName,
  price,
  marginPct,
  rebatePct,
  netPrice,
  loanAmount,
  cashBack,
  rate,
  tenureYears,
  installment,
  showEntryCost,
  entryCostBreakdown
}) {
  const lines = [];

  lines.push(`⚡ *${BRAND.name} – Snap Quote*`);
  if (projectName) {
    lines.push(`🏢 Project: *${projectName}*`);
  }
  lines.push('');
  lines.push(`💰 Price: *${formatCurrency(price)}*`);
  lines.push(`📌 Margin: *${marginPct}%*`);
  lines.push(`🎁 Rebate: *${rebatePct}%*`);
  lines.push(`🏷 Net Price: *${formatCurrency(netPrice)}*`);
  lines.push(`🏦 Loan Amount: *${formatCurrency(loanAmount)}*`);

  if (cashBack > 0) {
    lines.push(`💵 Cash Back (Loan - Net): *${formatCurrency(cashBack)}*`);
  }

  lines.push('');
  lines.push(`📉 Rate: *${roundUp(rate, 2)}%*`);
  lines.push(`⏳ Tenure: *${tenureYears} years*`);
  lines.push(`💸 Est. Installment: *${formatCurrency(installment)} / month*`);

  if (showEntryCost && entryCostBreakdown) {
    lines.push('');
    lines.push(`🧾 *Estimated Entry Cost*`);
    lines.push(`• Legal Fee: ${formatCurrency(entryCostBreakdown.legalFee)}`);
    lines.push(`• MOT Stamp Duty: ${formatCurrency(entryCostBreakdown.motStampDuty)}`);
    lines.push(`• Loan Stamp Duty: ${formatCurrency(entryCostBreakdown.loanStampDuty)}`);
    lines.push(`➡️ Total: *${formatCurrency(entryCostBreakdown.total)}*`);
  }

  lines.push('');
  lines.push(`👨‍💼 Agent: *${agentName || '-'}*`);
  lines.push('');
  lines.push(
    `⚠️ All figures are estimates for discussion only and subject to final bank & legal approval.`
  );

  return lines.join('\n');
}
