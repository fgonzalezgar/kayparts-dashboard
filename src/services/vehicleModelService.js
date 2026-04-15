import api from './api';

const vehicleModelService = {
  async getModels(brandId = null) {
    try {
      const url = brandId ? `vehicle-models?brand_id=${brandId}` : 'vehicle-models';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle models:', error);
      throw error;
    }
  },

  async createModel(data) {
    try {
      const formData = new FormData();
      formData.append('brand_id', data.brand_id);
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('year_from', data.year_from || '');
      formData.append('year_to', data.year_to || '');
      formData.append('is_active', data.is_active ? 1 : 0);
      
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await api.post('vehicle-models', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating vehicle model:', error);
      throw error;
    }
  },

  async updateModel(id, data) {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // For Laravel to handle multipart PUT
      formData.append('brand_id', data.brand_id);
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('year_from', data.year_from || '');
      formData.append('year_to', data.year_to || '');
      formData.append('is_active', data.is_active ? 1 : 0);
      
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await api.post(`vehicle-models/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating vehicle model:', error);
      throw error;
    }
  },

  async deleteModel(id) {
    try {
      const response = await api.delete(`vehicle-models/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting vehicle model:', error);
      throw error;
    }
  }
};

export default vehicleModelService;
