import React from 'react';
import { useAppContext } from '../../state/AppContext.jsx';

export default function WatermarkOverlay() {
  const { user } = useAppContext();
  const timestamp = new Date().toLocaleString();

  return (
    <div className="pointer-events-none fixed inset-0 z-10 opacity-20 select-none">
      <div className="w-full h-full flex flex-wrap items-center justify-center text-[10px] text-slate-300">
        {Array.from({ length: 60 }).map((_, idx) => (
          <div key={idx} className="px-2 py-1">
            {user?.phone || 'Protected'} • {timestamp}
          </div>
        ))}
      </div>
    </div>
  );
}
