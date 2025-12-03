import React, { useEffect, useState } from "react";
import Card from "../common/Card";
import NumberInput from "../common/NumberInput";

function OnboardingForm({ initialData, onComplete }) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
    }
  }, [initialData]);

  const validate = () => {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required.";
    if (!phone.trim()) {
      nextErrors.phone = "WhatsApp number is required.";
    } else if (!/^\+?\d{8,15}$/.test(phone.trim())) {
      nextErrors.phone = "Enter a valid phone number (e.g. +6012xxxxxxx).";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };
    onComplete(payload);
  };

  return (
    <Card
      title="Welcome to 3Minutes"
      subtitle="Mortgage Intelligence in 3 Minutes. Let’s personalise your experience."
      className="max-w-lg mx-auto"
      padded={false}
    >
      <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 space-y-3">
        <div>
          <label
            htmlFor="onboard-name"
            className="mb-1 block text-xs font-medium text-slate-200"
          >
            Name
          </label>
          <input
            id="onboard-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className={`w-full rounded-lg border bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none
            border-slate-700/80 focus:border-emerald-400/90 focus:ring-1 focus:ring-emerald-500/60`}
          />
          {errors.name && (
            <p className="mt-1 text-[11px] text-crimson-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="onboard-email"
            className="mb-1 block text-xs font-medium text-slate-200"
          >
            Email (Optional)
          </label>
          <input
            id="onboard-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={`w-full rounded-lg border bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none
            border-slate-700/80 focus:border-emerald-400/90 focus:ring-1 focus:ring-emerald-500/60`}
          />
          {errors.email && (
            <p className="mt-1 text-[11px] text-crimson-400">{errors.email}</p>
          )}
        </div>

        <div>
          <NumberInput
            id="onboard-phone"
            label="WhatsApp Number"
            prefix="+"
            value={phone.replace(/^\+/, "")}
            onChange={(num) => {
              if (num === "") {
                setPhone("");
              } else {
                setPhone("+" + String(num));
              }
            }}
            placeholder="6012xxxxxxx"
            error={errors.phone}
            helperText="Used for watermarking in Banker View and WhatsApp exports."
          />
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-full
             bg-gradient-to-r from-amberBrand via-limeBrand to-violetBrand
             px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg
             hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-violetBrand/70
             focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Enter 3Minutes
        </button>
      </form>
    </Card>
  );
}

export default OnboardingForm;
