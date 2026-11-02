import axios from "axios";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../utils/tokens";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// One shared refresh request, even if several calls fail at the same moment.
let refreshing = null;
function refreshAccessToken() {
  if (!refreshing) {
    const refresh = getRefreshToken();
    if (!refresh) return Promise.reject(new Error("No refresh token"));
    refreshing = axios
      .post(`${baseURL}/auth/refresh/`, { refresh })
      .then((response) => {
        setTokens(response.data.access, response.data.refresh);
        return response.data.access;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

function friendly(error) {
  const status = error.response?.status;
  if (!error.response) return "Cannot reach the server. Please check your connection and try again.";
  if (status === 429) return "Too many requests. Please wait a little and try again.";
  if (status >= 500) return "The server had a problem. Please try again shortly.";
  if (error.response.data?.detail) return error.response.data.detail;
  return "Something went wrong. Please try again.";
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes("/auth/");
    const hasSession = Boolean(getAccessToken() || getRefreshToken());

    if (status === 401 && original && !original._retry && !isAuthCall && hasSession) {
      original._retry = true;
      try {
        const token = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        // Session is really over: log out, then retry as a guest so public pages still work.
        clearTokens();
        window.dispatchEvent(new Event("auth:logout"));
        delete original.headers.Authorization;
        return api(original);
      }
    }

    error.friendlyMessage = friendly(error);
    return Promise.reject(error);
  }
);

export default api;
