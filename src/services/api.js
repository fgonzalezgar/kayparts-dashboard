import axios from 'axios';

// ── Base configuration ───────────────────────────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kayparts.co/api/';
export const ASSETS_BASE_URL = API_BASE_URL.replace('/api/', '/public/');
export const BASE_URL = API_BASE_URL.replace('/api/', '/');

/**
 * Helper to get the correct URL for an asset (category image, subcategory image, etc.)
 * handles absolute URLs from API, relative paths, and provides fallbacks.
 */
export const getAssetUrl = (path, type = 'uploads') => {
  if (!path) return null;
  if (typeof path !== 'string') return null;
  
  // If it's already an absolute URL, return it
  if (path.startsWith('http')) {
    // Resilience: ensure it uses production domains if it came from localhost
    if (path.includes('localhost') || path.includes('127.0.0.1')) {
      return path.replace(/http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/*/, BASE_URL);
    }
    return path;
  }

  // Clean the path from common prefixes that might be duplicated
  const cleanPath = path
    .replace(/^\/+/, '')
    .replace('public/', '')
    .replace('storage/', '')
    .replace('uploads/', '');

  // If type is uploads, we use the BASE_URL/uploads/ path
  // (which maps to public/uploads/ in the server)
  return `${BASE_URL}uploads/${cleanPath}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Best practice para Laravel: fuerza retornos JSON en validaciones
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

    // 401 Unauthorized o 419 Page Expired (CSRF) → limpiar sesión y redirigir
    if ((status === 401 || status === 419) && typeof window !== 'undefined') {
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
