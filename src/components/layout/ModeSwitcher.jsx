import React from 'react';
import { MODES } from '../../lib/constants.js';
import { useAppContext } from '../../state/AppContext.jsx';

const options = [
  { id: MODES.CUSTOMER, label: 'Customer' },
  { id: MODES.AGENT, label: 'Agent' },
  { id: MODES.BANKER, label: 'Banker' }
];

export default function ModeSwitcher() {
  const { mode, setMode } = useAppContext();

  return (
    <div className="inline-flex items-center rounded-full bg-slate-900 border border-slate-700 p-1 text-[11px]">
      {options.map((opt) => {
        const active = mode === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setMode(opt.id)}
            className={`px-2.5 py-1 rounded-full transition text-xs ${
              active
                ? 'bg-emerald text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
