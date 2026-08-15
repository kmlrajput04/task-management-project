import dashboardService from '../services/dashboard.service.js';
import { dashboardQuerySchema } from '../schemas/dashboard.schema.js';
import { validateSchema } from '../utils/validation.js';
import { successResponse } from '../utils/response.js';

export const dashboardController = {
  async getDashboard(req, res, next) {
    try {
      // Validate request query parameters
      const validatedQuery = validateSchema(dashboardQuerySchema, req.query);

      // Call service layer to perform aggregations
      const dashboardData = await dashboardService.getDashboardData(validatedQuery.userId);

      return successResponse(res, dashboardData, 'Dashboard data retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
};

export default dashboardController;
