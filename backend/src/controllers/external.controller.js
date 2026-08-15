import externalService from '../services/external.service.js';
import { successResponse } from '../utils/response.js';

export const externalController = {
  async getExternalUsers(req, res, next) {
    try {
      const { data, cached, sourceUrl } = await externalService.getExternalUsers();
      
      const meta = {
        source: sourceUrl || 'JSONPlaceholder',
        cached
      };

      return successResponse(res, data, 'External users retrieved successfully', 200, meta);
    } catch (error) {
      next(error);
    }
  },

  async getSettings(req, res, next) {
    try {
      const settings = await externalService.getSettings();
      return successResponse(res, settings, 'Settings retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async saveSettings(req, res, next) {
    try {
      const { apiUrl, apiHeaders } = req.body;
      const result = await externalService.saveSettings({ apiUrl, apiHeaders });
      return successResponse(res, result, 'Settings updated successfully');
    } catch (error) {
      next(error);
    }
  }
};

export default externalController;
