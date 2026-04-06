'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // verificar sesión al iniciar

  // Rehydrate session from localStorage on first mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('kayparts_token');
      const storedUser = localStorage.getItem('kayparts_user');

      if (storedToken) {
        setToken(storedToken);
        try {
          // Intentar validar la sesión y traer el usuario actualizado
          const userData = await authService.getMe();
          const realUser = userData.user || userData.data || userData;
          setUser(realUser);
          localStorage.setItem('kayparts_user', JSON.stringify(realUser));
        } catch (error) {
          // Si el token es inválido (401), el interceptor ya limpia localStorage
          if (storedUser && error.response?.status !== 401) {
            // Fallback si falla la red pero no es error de auth
            setUser(JSON.parse(storedUser));
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Iniciar sesión y persistir sesión.
   * @param {{ email: string, password: string }} credentials
   */
  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);

    // Normalizar el token (algunas APIs devuelven access_token, otras token)
    const receivedToken = data.token || data.access_token || data.data?.token || data.data?.access_token;

    if (!receivedToken) {
      throw new Error('No se recibió un token de acceso del servidor.');
    }

    // Guardarlo de inmediato para que autService.getMe() pueda usarlo mediante el interceptor
    localStorage.setItem('kayparts_token', receivedToken);
    
    let userProfile = data.user || data.data?.user;
    
    // Si la API no retornó el usuario en el login, lo consultamos con el token recién guardado
    if (!userProfile || Object.keys(userProfile).length === 0) {
      try {
        const userData = await authService.getMe();
        userProfile = userData.user || userData.data || userData;
      } catch (err) {
        userProfile = {};
      }
    }

    localStorage.setItem('kayparts_user', JSON.stringify(userProfile || {}));

    setToken(receivedToken);
    setUser(userProfile || {});

    return { token: receivedToken, user: userProfile };
  }, []);

  /**
   * Cerrar sesión y limpiar estado.
   */
  const logout = useCallback(async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return context;
};

export default AuthContext;
