// src/api.js
import axios from "axios";

// 1️⃣ Axios örneği oluştur
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // örn. "http://localhost:5000/api"
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 2️⃣ Her isteğe token ekleyen request interceptor
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

// 3️⃣ 401 yakalayıp otomatik logout + yönlendirme yapan response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersizse temizle ve login’e dön
      localStorage.removeItem("token");
      window.location.href = "/admin";
    }
    return Promise.reject(error);
  }
);

// 4️⃣ Manuel olarak header’ı değiştirmek isterseniz:
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
