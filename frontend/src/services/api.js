import axios from "axios";

// Determine the base URL from the Vite env variable or fallback to production
const rawBase = import.meta.env.VITE_API_URL || "https://autopremium-yaip.onrender.com";
// Ensure /api suffix so routes like /Auth/login become /api/Auth/login
const API_BASE_URL = rawBase.endsWith("/api") ? rawBase : `${rawBase.replace(/\/+$/, "")}/api`;

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
      // Don't redirect for login requests - let the login handler display the error
      if (error.config?.url?.includes("/Auth/login") || error.config?.url?.includes("/Auth/reset-password")) {
        return Promise.reject(error);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
