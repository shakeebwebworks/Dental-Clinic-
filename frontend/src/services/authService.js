import api from "./api";

export const loginRequest = async (username, password) => {
  const response = await api.post("/auth/login/", { username, password });
  return response.data;
};

export const registerRequest = async (payload) => {
  const response = await api.post("/auth/register/", payload);
  return response.data;
};

export const logoutRequest = async (refresh) => {
  await api.post("/auth/logout/", { refresh });
};

export const getMe = async () => {
  const response = await api.get("/auth/me/");
  return response.data;
};
