import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response; // response payload: { success, data: { token, user } }
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response; // response payload: { success, data: user }
  }
};

export default authService;
