import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getJSON, setJSON } from '../lib/storage.js';
import { fetchDefaults, logInterestOverride } from '../lib/hiveMindClient.js';
import { DEFAULTS_STORAGE_KEY, USER_STORAGE_KEY, MODES } from '../lib/constants.js';
import defaultsLocal from '../data/defaults.json';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState(MODES.CUSTOMER);
  const [defaults, setDefaults] = useState({
    defaultInterestRate: defaultsLocal.defaultInterestRate,
    defaultTenureYears: defaultsLocal.defaultTenureYears,
    defaultDownpaymentPct: defaultsLocal.defaultDownpaymentPct
  });
  const [loadingDefaults, setLoadingDefaults] = useState(true);

  useEffect(() => {
    const storedUser = getJSON(USER_STORAGE_KEY);
    if (storedUser) setUser(storedUser);

    const storedDefaults = getJSON(DEFAULTS_STORAGE_KEY);
    if (storedDefaults) {
      setDefaults((prev) => ({ ...prev, ...storedDefaults }));
    }

    let cancelled = false;

    async function initDefaults() {
      try {
        const remote = await fetchDefaults();
        if (!cancelled && remote) {
          setDefaults((prev) => ({ ...prev, ...remote }));
          setJSON(DEFAULTS_STORAGE_KEY, { ...defaults, ...remote });
        }
      } catch {
        // ignore network errors, keep local defaults
      } finally {
        if (!cancelled) setLoadingDefaults(false);
      }
    }

    initDefaults();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveUser = useCallback((userData) => {
    setUser(userData);
    setJSON(USER_STORAGE_KEY, userData);
  }, []);

  const updateMode = useCallback((nextMode) => {
    setMode(nextMode);
  }, []);

  const handleInterestOverride = useCallback(
    (newRate) => {
      setDefaults((prev) => {
        const next = { ...prev, defaultInterestRate: newRate };
        setJSON(DEFAULTS_STORAGE_KEY, next);
        return next;
      });
      logInterestOverride(newRate).catch(() => {});
    },
    []
  );

  const value = {
    user,
    setUser: saveUser,
    mode,
    setMode: updateMode,
    defaults,
    setDefaults,
    loadingDefaults,
    onInterestOverride: handleInterestOverride
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return ctx;
}
