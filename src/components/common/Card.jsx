import React from 'react';

export default function Card({ title, subtitle, right, children, id }) {
  return (
    <section id={id} className="app-card">
      {(title || subtitle || right) && (
        <div className="app-card-header">
          <div>
            {title && <div className="app-card-title">{title}</div>}
            {subtitle && <div className="app-card-subtitle">{subtitle}</div>}
          </div>
          {right && <div className="flex items-center gap-2">{right}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}
