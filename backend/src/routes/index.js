import { Router } from 'express';
import healthRoutes from './health.routes.js';
import usersRoutes from './users.routes.js';
import tasksRoutes from './tasks.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import commentsRoutes from './comments.routes.js';
import externalRoutes from './external.routes.js';
import authRoutes from './auth.routes.js';
import notificationsRoutes from './notifications.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', usersRoutes);
router.use('/tasks', tasksRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/comments', commentsRoutes);
router.use('/external', externalRoutes);
router.use('/auth', authRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
