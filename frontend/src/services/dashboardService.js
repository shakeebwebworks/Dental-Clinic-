import api from "./api";

// Removes empty filters so they are not sent to the API.
const clean = (params) =>
  Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== "" && v !== null && v !== undefined));

export const getStats = async () => (await api.get("/appointments/stats/")).data;

export const listAppointments = async (params) =>
  (await api.get("/appointments/", { params: clean(params) })).data;
export const updateAppointment = async (id, data) =>
  (await api.patch(`/appointments/${id}/`, data)).data;
export const deleteAppointment = async (id) => {
  await api.delete(`/appointments/${id}/`);
};

export const listEnquiries = async (params) =>
  (await api.get("/enquiries/", { params: clean(params) })).data;
export const updateEnquiry = async (id, data) =>
  (await api.patch(`/enquiries/${id}/`, data)).data;
export const deleteEnquiry = async (id) => {
  await api.delete(`/enquiries/${id}/`);
};

export const listReviews = async (params) =>
  (await api.get("/testimonials/", { params: clean(params) })).data;
export const updateReview = async (id, data) =>
  (await api.patch(`/testimonials/${id}/`, data)).data;
export const deleteReview = async (id) => {
  await api.delete(`/testimonials/${id}/`);
};
