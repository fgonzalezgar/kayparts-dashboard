import api from './api';

const subcategoryService = {
  /**
   * Obtener todas las subcategorías.
   * @param {number|string} categoryId - Opcional: filtrar por ID de categoría padre.
   * @returns {Promise<Array>} Lista de subcategorías
   */
  async getSubcategories(categoryId = null) {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await api.get('subcategories', { params });
    return response.data.data || response.data;
  },

  /**
   * Crear una nueva subcategoría con soporte para imagen.
   * @param {Object} data - Objeto que contiene category_id, name, description e image (File).
   * @returns {Promise<Object>} Subcategoría creada
   */
  async createSubcategory(data) {
    const formData = new FormData();
    formData.append('category_id', data.category_id);
    formData.append('name', data.name);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.post('subcategories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data || response.data;
  },

  /**
   * Eliminar una subcategoría por su ID.
   * @param {number|string} id - ID de la subcategoría a eliminar
   */
  async deleteSubcategory(id) {
    await api.delete(`subcategories/${id}`);
  },

  /**
   * Actualizar una subcategoría existente (soporta cambio de imagen).
   * @param {number|string} id - ID de la subcategoría
   * @param {Object} data - Datos a actualizar (category_id, name, description, image)
   * @returns {Promise<Object>} Subcategoría actualizada
   */
  async updateSubcategory(id, data) {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Truco para Laravel con multipart/form-data
    
    if (data.category_id) formData.append('category_id', data.category_id);
    if (data.name) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description || '');
    
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    // El endpoint de actualización suele ser POST /{id} con _method=PUT para archivos en Laravel
    const response = await api.post(`subcategories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data || response.data;
  }
};

export default subcategoryService;
