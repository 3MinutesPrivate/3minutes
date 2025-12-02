import React, { useState } from 'react';
import { useAppContext } from '../../state/AppContext.jsx';

export default function Onboarding() {
  const { setUser } = useAppContext();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setUser(form);
  };

  return (
    <div className="app-card max-w-md w-full">
      <div className="app-card-header">
        <div>
          <div className="app-card-title">Welcome to 3Minutes</div>
          <div className="app-card-subtitle">
            Register your basic details to personalize your experience.
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div>
          <label className="app-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            className="app-input"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>
        <div>
          <label className="app-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            className="app-input"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="app-label" htmlFor="phone">
            Phone (WhatsApp)
          </label>
          <input
            id="phone"
            name="phone"
            className="app-input"
            value={form.phone}
            onChange={handleChange}
            placeholder="+60..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full mt-2 py-2 text-sm font-semibold rounded-md bg-emerald text-slate-950 hover:bg-emerald/90 transition"
        >
          Enter 3Minutes
        </button>
      </form>
    </div>
  );
}
