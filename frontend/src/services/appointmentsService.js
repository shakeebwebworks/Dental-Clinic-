import api from "./api";

// Returns the free time slots for a day, for example ["09:00 AM", "10:00 AM"].
export const getAvailability = async (date, doctorId) => {
  const params = { date };
  if (doctorId) params.doctor = doctorId;
  const response = await api.get("/appointments/availability/", { params });
  return response.data.available;
};

export const createAppointment = async (payload) => {
  const response = await api.post("/appointments/", payload);
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await api.get("/appointments/my/");
  return response.data;
};
