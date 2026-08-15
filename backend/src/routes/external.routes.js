import { Router } from 'express';
import { externalController } from '../controllers/external.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';

const router = Router();

// Protect all external integration routes
router.use(authMiddleware);

router.get('/users', externalController.getExternalUsers);
router.get('/settings', allowRoles('ADMIN', 'MANAGER'), externalController.getSettings);
router.post('/settings', allowRoles('ADMIN', 'MANAGER'), externalController.saveSettings);

export default router;
