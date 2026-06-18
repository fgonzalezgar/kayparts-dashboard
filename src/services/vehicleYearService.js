import api from './api';

const vehicleYearService = {
  /**
   * Obtener todos los años.
   * @returns {Promise<Array>} Lista de años
   */
  async getYears() {
    try {
      const response = await api.get('vehicle-years');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching vehicle years:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo año.
   * @param {Object} data - Objeto { year: number }
   * @returns {Promise<Object>} Año creado
   */
  async createYear(data) {
    try {
      const response = await api.post('vehicle-years', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating vehicle year:', error);
      throw error;
    }
  },

  /**
   * Actualizar un año existente.
   * @param {number|string} id - ID del año
   * @param {Object} data - Objeto { year: number }
   * @returns {Promise<Object>} Año actualizado
   */
  async updateYear(id, data) {
    try {
      const response = await api.put(`vehicle-years/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error updating vehicle year ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un año por su ID.
   * @param {number|string} id - ID del año a eliminar
   */
  async deleteYear(id) {
    try {
      await api.delete(`vehicle-years/${id}`);
    } catch (error) {
      console.error(`Error deleting vehicle year ${id}:`, error);
      throw error;
    }
  }
};

export default vehicleYearService;
