import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import { commentController } from '../controllers/comment.controller.js';

const router = Router();

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Task comments endpoints
router.get('/:id/comments', commentController.getTaskComments);
router.post('/:id/comments', commentController.createTaskComment);

export default router;
