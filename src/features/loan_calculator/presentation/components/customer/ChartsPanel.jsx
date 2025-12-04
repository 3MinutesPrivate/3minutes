import React from "react";
import Card from "../../../../../components/common/Card.jsx";
import { buildAmortizationSchedule } from "../../../../../utils/financialEngine.js";
import { formatCurrency } from "../../../../../utils/formatters.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#10B981", "#DC2626"];

function ChartsPanel({ calcState }) {
  const { loanPrincipal, interestRate, tenureYears, startDate } =
    calcState || {};

  const schedule = React.useMemo(() => {
    if (!loanPrincipal || !interestRate || !tenureYears || !startDate) {
      return [];
    }
    return buildAmortizationSchedule(
      loanPrincipal,
      interestRate,
      tenureYears,
      startDate
    );
  }, [loanPrincipal, interestRate, tenureYears, startDate]);

  const chartData = React.useMemo(() => {
    let cumInterest = 0;
    return schedule.map((row) => {
      cumInterest += row.interest;
      return {
        monthIndex: row.monthIndex,
        label: `${row.month}/${row.year}`,
        balance: Math.round(row.balance),
        cumulativeInterest: Math.round(cumInterest),
      };
    });
  }, [schedule]);

  const donutData = React.useMemo(() => {
    if (!schedule.length) {
      return [
        { name: "Principal", value: 0 },
        { name: "Interest", value: 0 },
      ];
    }
    const totalPayment = schedule.reduce(
      (sum, row) => sum + row.payment,
      0
    );
    const totalInterest = totalPayment - loanPrincipal;
    return [
      { name: "Principal", value: loanPrincipal },
      { name: "Interest", value: totalInterest },
    ];
  }, [schedule, loanPrincipal]);

  return (
    <Card
      title="Visual Breakdown"
      subtitle="Balance vs interest over time, and overall cost split."
    >
      <div className="space-y-4">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1F2937"
                vertical={false}
              />
              <XAxis
                dataKey="monthIndex"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickFormatter={(v) => `M${v}`}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickFormatter={(v) =>
                  v >= 1000 ? `${v / 1000}k` : v
                }
              />
              <RechartsTooltip
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => `Month ${label}`}
                contentStyle={{
                  backgroundColor: "#020617",
                  borderColor: "#1F2937",
                  fontSize: 11,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(value) => (
                  <span style={{ color: "#E5E7EB" }}>{value}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="balance"
                name="Outstanding Balance"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="cumulativeInterest"
                name="Cumulative Interest"
                stroke="#DC2626"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-52 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
              >
                {donutData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "#020617",
                  borderColor: "#1F2937",
                  fontSize: 11,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

export default ChartsPanel;
