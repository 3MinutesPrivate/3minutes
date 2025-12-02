import React from 'react';
import { BRAND } from '../../lib/constants.js';
import ModeSwitcher from './ModeSwitcher.jsx';
import { useAppContext } from '../../state/AppContext.jsx';

export default function Header() {
  const { user } = useAppContext();

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald flex items-center justify-center text-slate-950 font-bold text-lg">
            3M
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-100">
              {BRAND.name}
            </div>
            <div className="text-[11px] text-slate-400">{BRAND.tagline}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex flex-col items-end text-right">
              <div className="text-xs text-slate-200 font-medium">{user.name}</div>
              <div className="text-[11px] text-slate-400">{user.phone}</div>
            </div>
          )}
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
}
