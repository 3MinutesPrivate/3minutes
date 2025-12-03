import React from "react";
import { useAppContext } from "../../context/AppContext";

function WatermarkOverlay({ children }) {
  const { user } = useAppContext();
  const [timestamp] = React.useState(() => new Date().toISOString());

  const label = `${user?.phone || "UNREGISTERED"} • ${timestamp}`;

  const tiles = React.useMemo(() => {
    const rows = [];
    for (let r = 0; r < 6; r += 1) {
      const cols = [];
      for (let c = 0; c < 4; c += 1) {
        cols.push(`${r}-${c}`);
      }
      rows.push(cols);
    }
    return rows;
  }, []);

  return (
    <div className="relative">
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      >
        <div className="relative h-full w-full opacity-20">
          <div className="absolute inset-[-50%] rotate-[-30deg]">
            {tiles.map((row, rIdx) => (
              <div
                key={`wm-row-${rIdx}`}
                className="flex justify-around py-6"
              >
                {row.map((key) => (
                  <div
                    key={`wm-${key}`}
                    className="text-[10px] font-semibold uppercase tracking-wide text-slate-300"
                  >
                    {label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatermarkOverlay;
