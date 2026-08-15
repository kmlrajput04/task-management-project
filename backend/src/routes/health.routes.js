import { Router } from 'express';
import { successResponse } from '../utils/response.js';

const router = Router();

router.get('/', (req, res) => {
  return successResponse(res, {
    status: 'healthy',
    uptime: process.uptime()
  }, 'API is running');
});

export default router;
