import { Router } from 'express';
import { commentController } from '../controllers/comment.controller.js';

const router = Router({ mergeParams: true });

router.get('/', commentController.getTaskComments);
router.post('/', commentController.createTaskComment);

export default router;
