import api from './api';

const dispatchService = {
  async getDispatches(params = {}) {
    const response = await api.get('dispatches', { params });
    return response.data.data || response.data;
  },
  
  async createDispatch(data) {
    const response = await api.post('dispatches', data);
    return response.data.data || response.data;
  },
  
  async updateDispatch(id, data) {
    const response = await api.put(`dispatches/${id}`, data);
    return response.data.data || response.data;
  },
  
  async deleteDispatch(id) {
    const response = await api.delete(`dispatches/${id}`);
    return response.data;
  }
};

export default dispatchService;
