import { useCallback, useEffect, useState } from "react";

// Loads a list with filters. It keeps the old rows visible while the new ones load.
export default function useList(fetcher, params) {
  const [state, setState] = useState({ data: null, loading: true, error: "", status: null });
  const [reload, setReload] = useState(0);
  const key = JSON.stringify(params);

  useEffect(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true, error: "", status: null }));
    fetcher(JSON.parse(key))
      .then((data) => {
        if (active) setState({ data, loading: false, error: "", status: null });
      })
      .catch((err) => {
        if (active) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err.friendlyMessage || "Something went wrong.",
            status: err.response?.status ?? null,
          }));
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reload]);

  const refresh = useCallback(() => setReload((n) => n + 1), []);
  return { ...state, refresh };
}
