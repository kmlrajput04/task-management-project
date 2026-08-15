import { Router } from 'express';
import tasksController from '../controllers/tasks.controller.js';
import commentsRoutes from './comments.routes.js';
import commentsController from '../controllers/comments.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';

const router = Router();

// All tasks routes require authentication
router.use(authMiddleware);

router.get('/', tasksController.getAllTasks);
router.get('/:id', tasksController.getTaskById);
router.post('/', tasksController.createTask);
router.put('/:id', tasksController.updateTask);

// Delete task requires Admin or Manager role
router.delete('/:id', allowRoles('ADMIN', 'MANAGER'), tasksController.deleteTask);

// Mount comments routes
router.use('/:id/comments', commentsRoutes);

// Mount task activity history route
router.get('/:id/activity', commentsController.getTaskActivity);

export default router;
