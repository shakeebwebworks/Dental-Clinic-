import api from "./api";

export const createEnquiry = async (payload) => {
  const response = await api.post("/contact/", payload);
  return response.data;
};
