import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultHandbook from '../data/handbook.json';
import { HANDBOOK_STORAGE_KEY } from '../lib/constants.js';
import { getJSON, setJSON } from '../lib/storage.js';

const HandbookContext = createContext(null);

export function HandbookProvider({ children }) {
  const [handbook, setHandbook] = useState(() => {
    const stored = getJSON(HANDBOOK_STORAGE_KEY);
    return stored || defaultHandbook;
  });

  useEffect(() => {
    setJSON(HANDBOOK_STORAGE_KEY, handbook);
  }, [handbook]);

  const updateHandbook = useCallback((updater) => {
    setHandbook((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);

  const resetHandbook = useCallback(() => {
    setHandbook(defaultHandbook);
  }, []);

  return (
    <HandbookContext.Provider
      value={{
        handbook,
        updateHandbook,
        resetHandbook
      }}
    >
      {children}
    </HandbookContext.Provider>
  );
}

export function useHandbook() {
  const ctx = useContext(HandbookContext);
  if (!ctx) {
    throw new Error('useHandbook must be used within HandbookProvider');
  }
  return ctx;
}
