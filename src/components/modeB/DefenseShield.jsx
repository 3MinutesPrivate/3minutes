import React from "react";
import Card from "../common/Card";
import Select from "../common/Select";
import rawCompetitors from "../../data/competitors.json";

// 防呆：保证 competitors 一定是数组，哪怕 JSON 写错也不会把页面搞崩
const competitors = Array.isArray(rawCompetitors) ? rawCompetitors : [];

function DefenseShield() {
  const [selectedId, setSelectedId] = React.useState(
    competitors[0]?.id || ""
  );
  const [copied, setCopied] = React.useState(false);

  const safeCompetitors = React.useMemo(
    () => (Array.isArray(competitors) ? competitors : []),
    []
  );

  const selected = React.useMemo(
    () => safeCompetitors.find((c) => c.id === selectedId) || null,
    [safeCompetitors, selectedId]
  );

  const options = safeCompetitors.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleCopyArgument = async () => {
    if (!selected) return;

    const densityMetric = Array.isArray(selected.metrics)
      ? selected.metrics.find((m) => m.id === "density")
      : null;

    let message = "";

    if (densityMetric) {
      if (densityMetric.them > densityMetric.ours) {
        message = `Boss, ${selected.name} might look attractive but has very high density (${densityMetric.them} vs ${densityMetric.ours} units/acre). Our project is much better for privacy and comfort.`;
      } else if (densityMetric.them < densityMetric.ours) {
        const otherWins = Array.isArray(selected.metrics)
          ? selected.metrics
              .filter((m) => {
                if (m.id === "density") return false;
                const oursBetter = m.higherIsBetter
                  ? m.ours > m.them
                  : m.ours < m.them;
                return oursBetter;
              })
              .map((m) => m.label)
              .join(", ")
          : "";

        message = `Boss, ${selected.name} has lower density (${densityMetric.them} vs ${densityMetric.ours} units/acre), but our project wins on other key factors like ${
          otherWins || "package and overall livability"
        }.`;
      } else {
        message = `Boss, comparing ${selected.name} vs our project: density is similar, but our overall package and livability are stronger.`;
      }
    } else {
      const wins = Array.isArray(selected.metrics)
        ? selected.metrics
            .filter((m) => {
              const oursBetter = m.higherIsBetter
                ? m.ours > m.them
                : m.ours < m.them;
              return oursBetter;
            })
            .map((m) => m.label)
            .join(", ")
        : "";

      message = `Boss, comparing ${selected.name} vs our project: we stand out on ${
        wins || "overall value and livability"
      }.`;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(message);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const hasData = safeCompetitors.length > 0;

  return (
    <Card
      title="Defense Shield"
      subtitle="Position your project strongly against competing launches."
    >
      <div className="space-y-3">
        {hasData ? (
          <>
            <Select
              id="defense-competitor"
              label="Competitor Project"
              value={selectedId}
              onChange={setSelectedId}
              options={options}
              placeholder="Select competitor"
            />

            {selected ? (
              <div className="mt-2 grid gap-3 md:grid-cols-2 text-xs text-slate-200">
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-300">
                    Our Project
                  </div>
                  {Array.isArray(selected.metrics) &&
                    selected.metrics.map((m) => {
                      const oursBetter = m.higherIsBetter
                        ? m.ours > m.them
                        : m.ours < m.them;
                      return (
                        <div
                          key={m.id}
                          className={`flex items-center justify-between rounded-md px-2 py-1 ${
                            oursBetter
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-slate-900/80 text-slate-200"
                          }`}
                        >
                          <span>{m.label}</span>
                          <span className="font-semibold">{m.ours}</span>
                        </div>
                      );
                    })}
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-300">
                    {selected.name}
                  </div>
                  {Array.isArray(selected.metrics) &&
                    selected.metrics.map((m) => {
                      const themBetter = m.higherIsBetter
                        ? m.them > m.ours
                        : m.them < m.ours;
                      return (
                        <div
                          key={m.id}
                          className={`flex items-center justify-between rounded-md px-2 py-1 ${
                            themBetter
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-slate-900/80 text-slate-200"
                          }`}
                        >
                          <span>{m.label}</span>
                          <span className="font-semibold">{m.them}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Select a competitor project to see a side‑by‑side comparison.
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-slate-400">
            No competitor data found. Add an array of competitor objects in{" "}
            <code>src/data/competitors.json</code> to enable this module.
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400">
            Use this as a script when customers compare with nearby projects.
          </p>
          <button
            type="button"
            onClick={handleCopyArgument}
            disabled={!selected}
            className="inline-flex items-center rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? "Copied!" : "Copy Argument"}
          </button>
        </div>
      </div>
    </Card>
  );
}

export default DefenseShield;
