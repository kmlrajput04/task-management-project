import notificationsService from '../services/notifications.service.js';
import { successResponse } from '../utils/response.js';

export const notificationsController = {
  async getNotifications(req, res, next) {
    try {
      const userId = req.user.id;
      const notifications = await notificationsService.getUserNotifications(userId);
      return successResponse(res, notifications, 'Notifications retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async markRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const notification = await notificationsService.markAsRead(id, userId);
      return successResponse(res, notification, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  },

  async markAllRead(req, res, next) {
    try {
      const userId = req.user.id;
      await notificationsService.markAllRead(userId);
      return successResponse(res, null, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  }
};

export default notificationsController;
