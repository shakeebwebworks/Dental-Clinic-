import api from "./api";

export const getFeaturedReviews = async () => {
  const response = await api.get("/testimonials/", { params: { is_featured: true } });
  return response.data.results;
};

// The API returns 10 reviews per page, so we read every page.
export const getAllReviews = async () => {
  const all = [];
  for (let page = 1; page <= 20; page += 1) {
    const response = await api.get("/testimonials/", { params: { page } });
    all.push(...response.data.results);
    if (!response.data.next) break;
  }
  return all;
};

export const getReviewSummary = async () => {
  const response = await api.get("/testimonials/summary/");
  return response.data;
};
