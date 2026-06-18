import api from './api';

const vehicleDisplacementService = {
  /**
   * Obtener todos los cilindrajes.
   * @returns {Promise<Array>} Lista de cilindrajes
   */
  async getDisplacements() {
    try {
      const response = await api.get('vehicle-displacements');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching vehicle displacements:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo cilindraje.
   * @param {Object} data - Objeto { name: string }
   * @returns {Promise<Object>} Cilindraje creado
   */
  async createDisplacement(data) {
    try {
      const response = await api.post('vehicle-displacements', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating vehicle displacement:', error);
      throw error;
    }
  },

  /**
   * Actualizar un cilindraje existente.
   * @param {number|string} id - ID del cilindraje
   * @param {Object} data - Objeto { name: string }
   * @returns {Promise<Object>} Cilindraje actualizado
   */
  async updateDisplacement(id, data) {
    try {
      const response = await api.put(`vehicle-displacements/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error updating vehicle displacement ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un cilindraje por su ID.
   * @param {number|string} id - ID del cilindraje a eliminar
   */
  async deleteDisplacement(id) {
    try {
      await api.delete(`vehicle-displacements/${id}`);
    } catch (error) {
      console.error(`Error deleting vehicle displacement ${id}:`, error);
      throw error;
    }
  }
};

export default vehicleDisplacementService;
