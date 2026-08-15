import api from './api';

export const dashboardService = {
  async getDashboard(userId) {
    const params = userId ? { userId } : {};
    const response = await api.get('/dashboard', { params });
    return response; // Standard successResponse container
  }
};

export default dashboardService;
