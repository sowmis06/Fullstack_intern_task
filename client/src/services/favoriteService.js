import api from "./api.js";

export async function fetchFavorites() {
  const response = await api.get("/favorites");
  return response.data;
}

export async function addFavorite(templateId) {
  await api.post(`/favorites/${templateId}`);
}

export async function removeFavorite(templateId) {
  await api.delete(`/favorites/${templateId}`);
}
