import React, { useState } from "react";
import { useAuthStore } from "./authStore.jsx";
import { ROLES } from "../../features/loan_calculator/logic/roles.js";
import Card from "../../components/common/Card.jsx";
import NumberInput from "../../components/common/NumberInput.jsx";

// 邀请码常量：正式环境你可以自己换成更复杂的
const INVITE_CODES = {
  [ROLES.AGENT]: "BANKER_GENERATED_CODE",
  [ROLES.BANKER]: "BOSS_GENERATED_CODE",
  [ROLES.BOSS]: "3M_SUPER_BOSS", // Boss 专用 master code
};

function LoginScreen() {
  const { register } = useAuthStore();
  const [mode, setMode] = useState("register"); // 预留 login/register 切换
  const [role, setRole] = useState(ROLES.CUSTOMER);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  const needsInvite =
    role === ROLES.AGENT ||
    role === ROLES.BANKER ||
    role === ROLES.BOSS;

  const validateInvite = () => {
    if (!needsInvite) return true;
    const expected = INVITE_CODES[role];
    return inviteCode && inviteCode === expected;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!phone.trim()) {
      setError("WhatsApp number is required.");
      return;
    }
    if (!/^\+?\d{8,15}$/.test(phone.trim())) {
      setError("Enter a valid phone number (e.g. +6012xxxxxxx).");
      return;
    }
    if (!validateInvite()) {
      let msg;
      if (role === ROLES.AGENT) {
        msg =
          "Invalid invite code for Agent. Please obtain it from a banker.";
      } else if (role === ROLES.BANKER) {
        msg =
          "Invalid invite code for Banker. Only boss-generated codes are accepted.";
      } else if (role === ROLES.BOSS) {
        msg =
          "Invalid boss code. This access is reserved for the system owner only.";
      } else {
        msg = "Invalid invite code.";
      }
      setError(msg);
      return;
    }

    register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
    });
  };

  const roleLabel = (r) => {
    if (r === ROLES.CUSTOMER) return "Customer";
    if (r === ROLES.AGENT) return "Agent";
    if (r === ROLES.BANKER) return "Banker";
    if (r === ROLES.BOSS) return "Boss";
    return r;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <Card
        title="Welcome to 3Minutes"
        subtitle="Mother Base – please identify yourself to continue."
        className="max-w-lg w-full"
        padded={false}
      >
        <form
          onSubmit={handleSubmit}
          className="px-4 pb-4 pt-2 space-y-3"
        >
          {/* Role 切换 */}
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="text-slate-300 font-semibold">
              I am logging in as:
            </span>
            <div className="inline-flex rounded-full bg-slate-900/80 border border-slate-700/80 p-0.5">
              {[ROLES.CUSTOMER, ROLES.AGENT, ROLES.BANKER, ROLES.BOSS].map(
                (r) => {
                  const active = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`mx-0.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                        active
                          ? "bg-emerald-500 text-slate-900"
                          : "text-slate-300 hover:bg-slate-800/80"
                      }`}
                    >
                      {roleLabel(r)}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="auth-name"
              className="mb-1 block text-xs font-medium text-slate-200"
            >
              Name
            </label>
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400/90 focus:ring-1 focus:ring-emerald-500/60"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="auth-email"
              className="mb-1 block text-xs font-medium text-slate-200"
            >
              Email (Optional)
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400/90 focus:ring-1 focus:ring-emerald-500/60"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone */}
          <NumberInput
            id="auth-phone"
            label="WhatsApp Number"
            prefix="+"
            value={phone.replace(/^\+/, "")}
            onChange={(num) => {
              if (num === "") setPhone("");
              else setPhone("+" + String(num));
            }}
            placeholder="6012xxxxxxx"
            helperText="Used for watermarking in Banker View and WhatsApp exports."
          />

          {/* Invite code */}
          {needsInvite && (
            <div>
              <label
                htmlFor="auth-invite"
                className="mb-1 block text-xs font-medium text-slate-200"
              >
                Invite Code
              </label>
              <input
                id="auth-invite"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.trim())}
                className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400/90 focus:ring-1 focus:ring-emerald-500/60"
                placeholder={
                  role === ROLES.AGENT
                    ? "Code from banker"
                    : role === ROLES.BANKER
                    ? "Code from boss"
                    : "Boss master code"
                }
              />
              <p className="mt-1 text-[11px] text-slate-400">
                {role === ROLES.AGENT
                  ? "Agents require a banker-generated invite code."
                  : role === ROLES.BANKER
                  ? "Bankers require a boss-generated invite code."
                  : "Boss access is restricted. Keep this code secret."}
              </p>
            </div>
          )}

          {error && (
            <p className="text-[11px] text-crimson-400 mt-1">{error}</p>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            {mode === "register" ? "Enter 3Minutes" : "Sign in"}
          </button>

          <p className="mt-2 text-[10px] text-slate-500">
            All calculations are for reference only and subject to final bank
            approval. 3Minutes is a fintech tool, not a bank.
          </p>
        </form>
      </Card>
    </div>
  );
}

export default LoginScreen;
