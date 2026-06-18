import api from './api';

const taxService = {
  /**
   * Obtener todos los impuestos.
   * @returns {Promise<Array>} Lista de impuestos
   */
  async getTaxes() {
    try {
      const response = await api.get('taxes');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching taxes:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo impuesto.
   * @param {Object} data - Objeto { name: string, rate: number, is_active: boolean }
   * @returns {Promise<Object>} Impuesto creado
   */
  async createTax(data) {
    try {
      const response = await api.post('taxes', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating tax:', error);
      throw error;
    }
  },

  /**
   * Actualizar un impuesto existente.
   * @param {number|string} id - ID del impuesto
   * @param {Object} data - Objeto { name: string, rate: number, is_active: boolean }
   * @returns {Promise<Object>} Impuesto actualizado
   */
  async updateTax(id, data) {
    try {
      const response = await api.put(`taxes/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error updating tax ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un impuesto por su ID.
   * @param {number|string} id - ID del impuesto a eliminar
   */
  async deleteTax(id) {
    try {
      await api.delete(`taxes/${id}`);
    } catch (error) {
      console.error(`Error deleting tax ${id}:`, error);
      throw error;
    }
  }
};

export default taxService;
