import api from './api';

const carrierService = {
  async getCarriers(params = {}) {
    const response = await api.get('carriers', { params });
    return response.data.data || response.data;
  },
  
  async createCarrier(data) {
    const response = await api.post('carriers', data);
    return response.data.data || response.data;
  },
  
  async updateCarrier(id, data) {
    const response = await api.put(`carriers/${id}`, data);
    return response.data.data || response.data;
  },
  
  async deleteCarrier(id) {
    const response = await api.delete(`carriers/${id}`);
    return response.data;
  }
};

export default carrierService;
