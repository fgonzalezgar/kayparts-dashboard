import api from './api';

const categoryService = {
  /**
   * Obtener todas las categorías.
   * @returns {Promise<Array>} Lista de categorías
   */
  async getCategories() {
    const response = await api.get('categories');
    // Normalmente Laravel devuelve los datos paginados en response.data.data, 
    // pero si no está paginado podría estar en response.data.
    return response.data.data || response.data;
  },

  /**
   * Crear una nueva categoría con soporte para imagen.
   * @param {Object} data - Objeto que contiene name, description e image (File).
   * @returns {Promise<Object>} Categoría creada
   */
  async createCategory(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.post('categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data || response.data;
  },

  /**
   * Eliminar una categoría por su ID.
   * @param {number|string} id - ID de la categoría a eliminar
   */
  async deleteCategory(id) {
    await api.delete(`categories/${id}`);
  }
};

export default categoryService;
