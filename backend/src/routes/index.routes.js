import { Router } from 'express';
import healthRoutes from './health.routes.js';
import taskRoutes from './task.routes.js';
import userRoutes from './user.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import externalRoutes from './external.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/external', externalRoutes);

export default router;
