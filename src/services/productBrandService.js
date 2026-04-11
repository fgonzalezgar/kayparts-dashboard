import api from './api';

const productBrandService = {
  async getBrands() {
    try {
      const response = await api.get('product-brands');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching product brands:', error);
      throw error;
    }
  },

  async createBrand(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    
    if (data.description) formData.append('description', data.description);
    if (data.location) formData.append('location', data.location);
    if (data.image) formData.append('image', data.image);
    
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active ? 1 : 0);
    }

    const response = await api.post('product-brands', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.data || response.data;
  },

  async deleteBrand(id) {
    await api.delete(`product-brands/${id}`);
  },

  async updateBrand(id, data) {
    const formData = new FormData();
    formData.append('_method', 'PUT'); 
    
    if (data.name) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description || '');
    if (data.location !== undefined) formData.append('location', data.location || '');
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active ? 1 : 0);
    }
    
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const response = await api.post(`product-brands/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.data || response.data;
  }
};

export default productBrandService;
