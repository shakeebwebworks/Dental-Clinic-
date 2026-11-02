import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { getMe, loginRequest, logoutRequest, registerRequest } from "../services/authService";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../utils/tokens";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // On page load: if a session exists, fetch the current user.
  useEffect(() => {
    let active = true;
    if (!getAccessToken() && !getRefreshToken()) {
      setReady(true);
      return undefined;
    }
    getMe()
      .then((me) => {
        if (active) setUser(me);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // The API layer announces when the session could not be renewed.
  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await loginRequest(username, password);
    setTokens(data.access, data.refresh);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(
    async (payload) => {
      await registerRequest(payload);
      return login(payload.username, payload.password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    clearTokens();
    setUser(null);
    if (refresh) {
      try {
        await logoutRequest(refresh); // blacklists the refresh token on the server
      } catch {
        /* the local session is already cleared */
      }
    }
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
