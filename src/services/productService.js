import api from './api';

const productService = {
  /**
   * Obtener todos los productos, con soporte para paginación y búsqueda.
   * @param {string} search - Término de búsqueda opcional (nombre o SKU)
   * @returns {Promise<Array>} Lista de productos
   */
  async getProducts(search = '') {
    try {
      const params = search ? { search } : {};
      const response = await api.get('products', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Obtener los detalles de un producto por su ID.
   * @param {number|string} id - ID del producto
   * @returns {Promise<Object>} Datos del producto
   */
  async getProduct(id) {
    try {
      const response = await api.get(`products/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo producto.
   * @param {FormData} formData - Datos del producto (incluyendo imágenes)
   * @returns {Promise<Object>} Producto creado
   */
  async createProduct(formData) {
    try {
      const response = await api.post('products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  /**
   * Actualizar un producto existente.
   * Laravel requiere POST con _method=PUT para procesar multipart/form-data.
   * @param {number|string} id - ID del producto
   * @param {FormData} formData - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   */
  async updateProduct(id, formData) {
    try {
      // Nos aseguramos de que _method esté presente para Laravel
      if (!formData.has('_method')) {
        formData.append('_method', 'PUT');
      }
      
      const response = await api.post(`products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un producto.
   * @param {number|string} id - ID del producto
   */
  async deleteProduct(id) {
    try {
      const response = await api.delete(`products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // ── Helper API queries for form options ────────────────────────────────────

  async getSelectCategories() {
    const response = await api.get('selects/categories');
    return response.data;
  },

  async getSelectProductBrands() {
    const response = await api.get('selects/product-brands');
    return response.data;
  },

  async getSelectVehicleBrands() {
    const response = await api.get('selects/vehicle-brands');
    return response.data;
  },

  async getSelectVehicleModels(brandId = '') {
    const params = brandId ? { brand_id: brandId } : {};
    const response = await api.get('selects/vehicle-models', { params });
    return response.data;
  },

  async getSelectVehicleYears() {
    const response = await api.get('selects/vehicle-years');
    return response.data;
  },

  async getSelectVehicleDisplacements() {
    const response = await api.get('selects/vehicle-displacements');
    return response.data;
  },

  async getTaxes() {
    const response = await api.get('taxes');
    return response.data.data || response.data;
  }
};

export default productService;
