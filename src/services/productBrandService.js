import api from './api';

/**
 * Service for managing Product Brands via the Kayparts API.
 * Endpoint base: /api/product-brands
 *
 * API response fields: id, name, description, location, image, is_active, created_at, updated_at
 * Note: The image field contains the full URL to the stored image.
 */
const productBrandService = {
  /**
   * Obtener todas las marcas de productos.
   * @returns {Promise<Array>} Lista de marcas de productos
   */
  async getBrands() {
    try {
      const response = await api.get('product-brands');
      // Laravel puede devolver datos paginados en response.data.data
      // o directamente en response.data si no está paginado
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.data)) return data.data;
      return [];
    } catch (error) {
      console.error('Error fetching product brands:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva marca de producto con soporte para imagen.
   * @param {Object} data - { name, description, location, image (File), is_active }
   * @returns {Promise<Object>} Marca de producto creada
   */
  async createBrand(data) {
    const formData = new FormData();
    formData.append('name', data.name);

    if (data.description) formData.append('description', data.description);
    if (data.location)    formData.append('location',    data.location);

    // El campo de imagen debe llamarse 'image' según la API
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    // is_active: la API espera 1 o 0
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active ? 1 : 0);
    }

    const response = await api.post('product-brands', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data || response.data;
  },

  /**
   * Actualizar una marca de producto existente.
   * Laravel no procesa multipart/form-data en PUT directo,
   * por eso usamos POST + _method=PUT.
   * @param {number|string} id - ID de la marca
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Marca de producto actualizada
   */
  async updateBrand(id, data) {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Requerido por Laravel para multipart en update

    if (data.name)                    formData.append('name',        data.name);
    if (data.description !== undefined) formData.append('description', data.description || '');
    if (data.location !== undefined)    formData.append('location',    data.location || '');

    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active ? 1 : 0);
    }

    // Solo subir imagen si el usuario seleccionó una nueva
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const response = await api.post(`product-brands/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data || response.data;
  },

  /**
   * Eliminar una marca de producto por ID.
   * @param {number|string} id
   */
  async deleteBrand(id) {
    await api.delete(`product-brands/${id}`);
  },

  /**
   * Obtener una marca de producto específica por ID.
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  async getBrandById(id) {
    const response = await api.get(`product-brands/${id}`);
    return response.data.data || response.data;
  },
};

export default productBrandService;
