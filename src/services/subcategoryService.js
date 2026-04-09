import api from './api';

const subcategoryService = {
  /**
   * Obtener todas las subcategorías.
   * @param {number|string} categoryId - Opcional: filtrar por ID de categoría padre.
   * @returns {Promise<Array>} Lista de subcategorías
   */
  async getSubcategories(categoryId = null) {
    const params = categoryId ? { category_id: categoryId } : {};
    try {
      // Intentamos con plural estándar
      const response = await api.get('subcategories', { params });
      return response.data.data || response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback a versión con guion si el primero falla
        try {
          const fbResponse = await api.get('sub-categories', { params });
          return fbResponse.data.data || fbResponse.data;
        } catch (fbError) {
          throw error; // Lanzamos el error original si el fallback también falla
        }
      }
      throw error;
    }
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

    const tryPost = async (endpoint) => {
      return await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    };

    try {
      const response = await tryPost('subcategories');
      return response.data.data || response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const fbResponse = await tryPost('sub-categories');
          return fbResponse.data.data || fbResponse.data;
        } catch (fbError) {
          throw error;
        }
      }
      throw error;
    }
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

    const tryPost = async (endpoint) => {
      return await api.post(`${endpoint}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    };

    try {
      const response = await tryPost('subcategories');
      console.log('API update subcategory response:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const fbResponse = await tryPost('sub-categories');
          console.log('API update subcategory response (fallback):', fbResponse.data);
          return fbResponse.data.data || fbResponse.data;
        } catch (fbError) {
          throw error;
        }
      }
      throw error;
    }
  }
};

export default subcategoryService;
