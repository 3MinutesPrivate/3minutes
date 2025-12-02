import React from 'react';
import { MODES } from '../../lib/constants.js';
import { useAppContext } from '../../state/AppContext.jsx';

const tools = [
  {
    id: 'calculator',
    label: '3M Calculator',
    description: 'Core mortgage calculator with amortization and visualization.',
    anchor: '#mode-a'
  },
  {
    id: 'dsr',
    label: 'DSR Check',
    description: 'Quick affordability and commitment check.',
    anchor: '#mode-b-traffic'
  },
  {
    id: 'docs',
    label: 'Document List',
    description: 'Smart checklist based on customer persona.',
    anchor: '#mode-b-checklist'
  },
  {
    id: 'community',
    label: 'Community Rates',
    description: 'Live market interest defaults via Hive Mind.',
    anchor: '#mode-a-input'
  }
];

export default function ToolGrid() {
  const { setMode } = useAppContext();

  const handleClick = (tool) => {
    if (tool.id === 'calculator') {
      setMode(MODES.CUSTOMER);
    } else if (tool.id === 'dsr' || tool.id === 'docs') {
      setMode(MODES.AGENT);
    } else if (tool.id === 'community') {
      setMode(MODES.CUSTOMER);
    }
    if (tool.anchor && typeof window !== 'undefined') {
      setTimeout(() => {
        const el = document.querySelector(tool.anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {tools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          onClick={() => handleClick(tool)}
          className="app-card text-left hover:border-emerald/70 hover:shadow-lg transition"
        >
          <div className="text-sm font-semibold text-slate-100 mb-1">{tool.label}</div>
          <div className="text-xs text-slate-400">{tool.description}</div>
        </button>
      ))}
    </div>
  );
}
