import { Router } from 'express';
import commentsController from '../controllers/comments.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

router.use(authMiddleware);
router.get('/', commentsController.getTaskComments);
router.post('/', commentsController.createTaskComment);

export default router;
