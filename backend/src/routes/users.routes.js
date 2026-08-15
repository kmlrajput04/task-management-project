import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';

const router = Router();

// All users routes require authentication
router.use(authMiddleware);

// All users can query list of users for assignee dropdowns
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);

// Create/Update requires Admin or Manager
router.post('/', allowRoles('ADMIN', 'MANAGER'), usersController.createUser);
router.put('/:id', allowRoles('ADMIN', 'MANAGER'), usersController.updateUser);

// Delete user requires Admin only
router.delete('/:id', allowRoles('ADMIN'), usersController.deleteUser);

export default router;
