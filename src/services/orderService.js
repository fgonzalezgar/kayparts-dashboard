import api from './api';

const orderService = {
  async getOrders(params = {}) {
    const response = await api.get('orders', { params });
    return response.data.data || response.data;
  }
};

export default orderService;
