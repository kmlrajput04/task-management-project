import { Router } from 'express';
import notificationsController from '../controllers/notifications.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// Protect all notification routes
router.use(authMiddleware);

router.get('/', notificationsController.getNotifications);
router.patch('/read', notificationsController.markAllRead);
router.patch('/:id/read', notificationsController.markRead);

export default router;
