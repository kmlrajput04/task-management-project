import api from './api';

export const notificationService = {
  async getNotifications() {
    const res = await api.get('/notifications');
    return res;
  },

  async markRead(id) {
    const res = await api.patch(`/notifications/${id}/read`);
    return res;
  },

  async markAllRead() {
    const res = await api.patch('/notifications/read');
    return res;
  }
};

export default notificationService;
