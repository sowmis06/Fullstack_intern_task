import api from "./api.js";

export async function getTemplates(searchTerm, category) {
  const params = {};

  if (searchTerm.trim() !== "") {
    params.search = searchTerm.trim();
  }
  if (category !== "All") {
    params.category = category;
  }

  const response = await api.get("/templates", { params });
  return response.data;
}

export async function getTemplateById(id) {
  const response = await api.get(`/templates/${id}`);
  return response.data;
}
