import dashboardRepository from '../repositories/dashboard.repository.js';
import usersRepository from '../repositories/users.repository.js';
import { NotFoundError } from '../utils/errors.js';

export const dashboardService = {
  async getDashboardData(userId = null) {
    // 1. Validate user existence if userId is provided
    if (userId) {
      const userExists = await usersRepository.findById(userId);
      if (!userExists) {
        throw new NotFoundError(`User with ID ${userId} not found`);
      }
    }

    // 2. Fetch all aggregations and listings concurrently
    const [
      summary,
      overdueCount,
      statusDistribution,
      priorityDistribution,
      recentTasks,
      upcomingTasks,
      myTasks
    ] = await Promise.all([
      dashboardRepository.getSummaryCounts(userId),
      dashboardRepository.getOverdueCount(),
      dashboardRepository.getStatusDistribution(),
      dashboardRepository.getPriorityDistribution(),
      dashboardRepository.getRecentTasks(),
      dashboardRepository.getUpcomingTasks(),
      dashboardRepository.getMyTasks(userId)
    ]);

    // 3. Inject overdue tasks count into summary object
    summary.overdueTasks = overdueCount;

    return {
      summary,
      statusDistribution,
      priorityDistribution,
      recentTasks,
      upcomingTasks,
      myTasks
    };
  }
};

export default dashboardService;
