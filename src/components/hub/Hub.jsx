import React from 'react';
import ToolGrid from './ToolGrid.jsx';
import { useAppContext } from '../../state/AppContext.jsx';

export default function Hub() {
  const { user } = useAppContext();

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">
          Hello, {user?.name || 'Guest'}
        </h1>
        <p className="text-sm text-slate-400">
          Your central hub for smart mortgage decisions. Switch perspective anytime: Customer,
          Agent, or Banker.
        </p>
      </div>
      <ToolGrid />
    </section>
  );
}
