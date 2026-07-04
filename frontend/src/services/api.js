import axios from "axios";

// Fallback to the production URL if the Vite environment variable isn't set
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://autopremium-yaip.onrender.com";
// Ensure /api is at the end of the base URL if your backend routes require it
// const API_BASE_URL = import.meta.env.VITE_API_URL
//   ? `${import.meta.env.VITE_API_URL}/api`
//   : "https://autopremium-yaip.onrender.com/api";

// 1. Properly initialize the axios instance using the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 2. Request Interceptor: Attach JWT token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Response Interceptor: Catch 401s and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
