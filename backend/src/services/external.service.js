import axios from 'axios';
import cache from '../utils/cache.js';
import prisma from '../config/prisma.js';

const CACHE_KEY = 'external_users';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const externalService = {
  async getSettings() {
    const urlSetting = await prisma.setting.findUnique({ where: { key: 'EXTERNAL_API_URL' } });
    const headersSetting = await prisma.setting.findUnique({ where: { key: 'EXTERNAL_API_HEADERS' } });
    
    if (!urlSetting) {
      throw new Error('API Gateway URL not configured in database settings');
    }

    return {
      apiUrl: urlSetting.value,
      apiHeaders: headersSetting?.value || '{}'
    };
  },

  async saveSettings({ apiUrl, apiHeaders }) {
    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: 'EXTERNAL_API_URL' },
        update: { value: apiUrl },
        create: { key: 'EXTERNAL_API_URL', value: apiUrl }
      }),
      prisma.setting.upsert({
        where: { key: 'EXTERNAL_API_HEADERS' },
        update: { value: apiHeaders || '{}' },
        create: { key: 'EXTERNAL_API_HEADERS', value: apiHeaders || '{}' }
      })
    ]);

    // Clear cache after updating settings to force sync
    cache.delete(CACHE_KEY);

    return { success: true };
  },

  async getExternalUsers() {
    // 1. Check cache first
    const cachedData = cache.get(CACHE_KEY);
    if (cachedData) {
      return {
        data: cachedData,
        cached: true
      };
    }

    // 2. Load API Gateway Settings from database
    const settings = await this.getSettings();
    const apiUrl = settings.apiUrl;
    let headers = {};
    try {
      headers = JSON.parse(settings.apiHeaders);
    } catch (e) {
      console.error('Failed to parse custom api headers:', e);
    }

    // 3. Fetch from API
    const response = await axios.get(apiUrl, {
      headers: {
        ...headers,
        'Accept': 'application/json',
        'User-Agent': 'TaskDashboard/1.0'
      },
      timeout: 5000
    });

    // Check data, data.data (ReqRes), and data.results (RandomUser) formats safely
    const rawUsers = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.data || response.data?.results || []);

    // 4. Transform response safely to keep UI bulletproof
    const transformedUsers = rawUsers.map((user, index) => {
      // Resolve Name (checks direct name, first/last name config, or name object)
      let resolvedName = 'Unknown User';
      if (user.name) {
        if (typeof user.name === 'object') {
          resolvedName = `${user.name.first || ''} ${user.name.last || ''}`.trim() || 'Unknown User';
        } else {
          resolvedName = user.name;
        }
      } else if (user.first_name) {
        resolvedName = `${user.first_name} ${user.last_name || ''}`.trim();
      } else if (user.username) {
        resolvedName = user.username;
      }

      return {
        id: String(user.id || user.login?.uuid || `ext-${index}`),
        name: resolvedName,
        email: user.email || 'N/A',
        company: typeof user.company === 'object' ? (user.company?.name || 'N/A') : (user.company || 'N/A'),
        city: typeof user.address === 'object' ? (user.address?.city || 'N/A') : (user.address || 'N/A'),
        phone: user.phone || 'N/A',
        website: user.website || 'N/A'
      };
    });

    // 5. Save to cache
    cache.set(CACHE_KEY, transformedUsers, CACHE_TTL);

    return {
      data: transformedUsers,
      cached: false,
      sourceUrl: apiUrl
    };
  }
};

export default externalService;
