import axios from 'axios';

// ── Base configuration ───────────────────────────────────────────────────────
const API_BASE_URL = 'https://api.kayparts.co/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// ── Request interceptor: attach Bearer token automatically ───────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('kayparts_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle global errors ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token expirado o inválido → limpiar sesión
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('kayparts_token');
      localStorage.removeItem('kayparts_user');
      // Redirigir solo si no estamos ya en /login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
