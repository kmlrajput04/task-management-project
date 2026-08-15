import axios from 'axios';
import { AppError, BadRequestError, NotFoundError } from './errors.js';

const client = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'TaskDashboard/1.0'
  }
});

// Configure retry strategy (Max 2 retries for network errors and timeouts)
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Check if we should retry
    if (!config || !config.retry) {
      config.retry = { count: 0, max: 2 };
    }

    const isNetworkOrTimeout = !error.response || error.code === 'ECONNABORTED' || error.message.includes('timeout');
    const isRetryable = isNetworkOrTimeout && config.retry.count < config.retry.max;

    if (isRetryable) {
      config.retry.count++;
      console.log(`[HTTP Client] Retry attempt #${config.retry.count} for request: ${config.url}`);
      return client(config);
    }

    // Normalize error responses
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || `External API failed with status ${status}`;

      if (status === 400) {
        throw new BadRequestError(message);
      }
      if (status === 404) {
        throw new NotFoundError(message);
      }
      throw new AppError(message, status);
    } else if (error.code === 'ECONNABORTED') {
      throw new AppError('External API call timed out after 5 seconds', 504);
    } else {
      throw new AppError('External API network connection failure', 502);
    }
  }
);

export default client;
