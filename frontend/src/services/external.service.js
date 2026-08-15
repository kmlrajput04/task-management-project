import api from './api';

export const externalService = {
  async getExternalUsers() {
    return await api.get('/external/users');
  },

  async getExternalSettings() {
    return await api.get('/external/settings');
  },

  async saveExternalSettings(data) {
    return await api.post('/external/settings', data);
  }
};
