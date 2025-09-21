// src/api/api.js
import axios from "axios";

// ======== Config dasar Axios ========
const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // optional: timeout 10 detik
});

// ======== Interceptor Request ========
// Menyisipkan token dari localStorage ke header Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ======== Interceptor Response ========
// Menangani error 401 (Unauthorized) secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Token tidak valid atau expired, silakan login ulang.");
        // Hapus token lama
        localStorage.removeItem("token");
        // Redirect ke halaman login
        window.location.href = "/login";
      } else if (error.response.data?.message) {
        // Error dari backend
        console.error("API Error:", error.response.data.message);
      }
    } else {
      console.error("Network/Server Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
