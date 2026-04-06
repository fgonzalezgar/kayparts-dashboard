import api from './api';

/**
 * Auth Service – todas las operaciones relacionadas con autenticación.
 * Base URL: https://api.kayparts.co/api
 *
 * Endpoints:
 *   POST /api/login   → Autentica y devuelve el token
 *   GET  /api/user    → Perfil del usuario autenticado
 *   POST /api/logout  → Revoca el token actual
 */
const authService = {
  /**
   * Iniciar sesión.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ token: string, user: object }>}
   */
  async login(credentials) {
    const response = await api.post('login', credentials);
    return response.data;
  },

  /**
   * Cerrar sesión (revoca el token en el servidor).
   */
  async logout() {
    try {
      await api.post('logout');
    } catch {
      // Ignorar errores al cerrar sesión; limpiamos localmente de todas formas
    } finally {
      localStorage.removeItem('kayparts_token');
      localStorage.removeItem('kayparts_user');
    }
  },

  /**
   * Obtener el perfil del usuario autenticado.
   * @returns {Promise<object>} datos del usuario
   */
  async getMe() {
    const response = await api.get('user');
    return response.data;
  },
};

export default authService;
