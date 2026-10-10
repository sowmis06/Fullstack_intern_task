import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export function saveToken(token, remember) {
  removeToken();
  if (remember) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
}

export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getErrorMessage(error) {
  if (error.response) {
    return error.response.data.message || "Something went wrong. Please try again.";
  }
  return "Could not reach the server. Please try again.";
}

export default api;
