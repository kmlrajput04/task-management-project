import notificationsRepository from '../repositories/notifications.repository.js';

export const notificationsService = {
  async getUserNotifications(userId) {
    // 1. Automatically clean up notifications older than 15 days
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    try {
      await notificationsRepository.deleteOlderThan(fifteenDaysAgo);
    } catch (err) {
      console.error('Failed to clean up old notifications:', err);
    }

    // 2. Fetch and return remaining notifications
    return await notificationsRepository.findMany(userId);
  },

  async createNotification(userId, { title, message, type, taskId = null }) {
    return await notificationsRepository.create({
      userId,
      title,
      message,
      type,
      taskId,
      read: false
    });
  },

  async markAsRead(id, userId) {
    return await notificationsRepository.update(id, { read: true });
  },

  async markAllRead(userId) {
    return await notificationsRepository.markAllRead(userId);
  }
};

export default notificationsService;
