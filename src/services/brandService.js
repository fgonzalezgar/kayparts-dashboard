import api from './api';

const brandService = {
  /**
   * Obtener todas las marcas.
   * @returns {Promise<Array>} Lista de marcas
   */
  async getBrands() {
    try {
      const response = await api.get('brands');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva marca con soporte para imagen.
   * @param {Object} data - Objeto que contiene name, description, location e image (File).
   * @returns {Promise<Object>} Marca creada
   */
  async createBrand(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    
    if (data.description) formData.append('description', data.description);
    if (data.location) formData.append('location', data.location);
    if (data.image) formData.append('image', data.image);
    
    // El estado activo por defecto es true, pero lo enviamos si está presente
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active ? 1 : 0);
    }

    const response = await api.post('brands', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data || response.data;
  },

  /**
   * Eliminar una marca por su ID.
   * @param {number|string} id - ID de la marca a eliminar
   */
  async deleteBrand(id) {
    await api.delete(`brands/${id}`);
  },

  /**
   * Actualizar una marca existente.
   * @param {number|string} id - ID de la marca
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Marca actualizada
   */
  async updateBrand(id, data) {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Truco para Laravel con multipart/form-data
    
    if (data.name) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description || '');
    if (data.location !== undefined) formData.append('location', data.location || '');
    
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active ? 1 : 0);
    }
    
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const response = await api.post(`brands/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data || response.data;
  }
};

export default brandService;
