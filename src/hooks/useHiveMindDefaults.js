import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

export function useHiveMindDefaults() {
  const { defaults, setDefaults } = useAppContext();
  const [loading, setLoading] = useState(!defaults);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (defaults) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchDefaults() {
      try {
        const base =
          import.meta.env.VITE_HIVEMIND_ENDPOINT || "/api/hivemind";
        const res = await fetch(`${base}/defaults`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HiveMind HTTP ${res.status}`);
        }

        const data = await res.json();
        const merged = {
          interestRate: 4.1,
          ...(data || {}),
        };
        setDefaults(merged);
      } catch (e) {
        setError(e);
        if (!defaults) {
          setDefaults({ interestRate: 4.1 });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDefaults();

    return () => controller.abort();
  }, [defaults, setDefaults]);

  const logRateOverride = useCallback(async (value) => {
    try {
      const base =
        import.meta.env.VITE_HIVEMIND_ENDPOINT || "/api/hivemind";
      await fetch(`${base}/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "INTEREST_RATE_OVERRIDE",
          value,
          ts: new Date().toISOString(),
        }),
        keepalive: true,
      });
    } catch {
      // fire-and-forget
    }
  }, []);

  return {
    defaults: defaults || { interestRate: 4.1 },
    loading,
    error,
    logRateOverride,
  };
}
