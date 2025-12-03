// Local storage wrapper for handbook.json-equivalent runtime config.

const STORAGE_KEY = "3m_handbook";

const DEFAULT_HANDBOOK = {
  global: {
    maxTenure: 35,
    maxAge: 70,
  },
  incomeMatrix: {
    basicSalary: { haircut: 1.0 },
    fixedAllowance: { haircut: 1.0 },
    commission: { haircut: 0.8 },
    bonus: { haircut: 0.7 },
    rental: { haircut: 0.8 },
    other: { haircut: 0.3 },
  },
  bankStrategies: {
    defaultDsrLimit: 0.6,
    banks: [
      {
        id: "mbb",
        name: "MBB",
        tier1Limit: 0.6,
        tier2Limit: 0.7,
        notes: "Tier 1 for strong profile, Tier 2 for borderline cases.",
      },
      {
        id: "cimb",
        name: "CIMB",
        tier1Limit: 0.6,
        tier2Limit: 0.7,
        notes: "",
      },
    ],
  },
};

function deepMerge(base, override = {}) {
  return {
    global: {
      ...base.global,
      ...(override.global || {}),
    },
    incomeMatrix: {
      ...base.incomeMatrix,
      ...(override.incomeMatrix || {}),
    },
    bankStrategies: {
      ...base.bankStrategies,
      ...(override.bankStrategies || {}),
    },
  };
}

export function loadHandbook() {
  if (typeof window === "undefined") {
    return { ...DEFAULT_HANDBOOK };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_HANDBOOK };
    }
    const parsed = JSON.parse(raw);
    return deepMerge(DEFAULT_HANDBOOK, parsed);
  } catch {
    return { ...DEFAULT_HANDBOOK };
  }
}

export function saveHandbook(handbook) {
  if (typeof window === "undefined") return;
  try {
    const merged = deepMerge(DEFAULT_HANDBOOK, handbook || {});
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
}

export function resetHandbook() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
