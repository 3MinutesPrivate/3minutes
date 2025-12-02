import React from 'react';
import { CONTACT, LEGAL } from '../../lib/constants.js';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-4 text-[11px] text-slate-400 space-y-2">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>📍 {CONTACT.address}</span>
          <span>☎ {CONTACT.phone}</span>
          <span>✉ {CONTACT.email}</span>
        </div>
        <div>{LEGAL.pdpaNotice}</div>
        <div className="text-[10px] text-slate-500">{LEGAL.disclaimer}</div>
      </div>
    </footer>
  );
}
