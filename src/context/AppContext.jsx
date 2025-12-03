import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [mode, setMode] = useState("customer");
  const [user, setUser] = useState(null);
  const [defaults, setDefaults] = useState(null);

  // onboarding – load from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("3m_user");
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem("3m_user", JSON.stringify(user));
      }
    } catch {
      // ignore
    }
  }, [user]);

  const value = {
    mode,
    setMode,
    user,
    setUser,
    defaults,
    setDefaults,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return ctx;
}
