import prisma from '../config/prisma.js';

export const dashboardRepository = {
  async getSummaryCounts(userId = null) {
    const total = await prisma.task.count();
    const pending = await prisma.task.count({ where: { status: 'PENDING' } });
    const inProgress = await prisma.task.count({ where: { status: 'IN_PROGRESS' } });
    const completed = await prisma.task.count({ where: { status: 'COMPLETED' } });
    const blocked = await prisma.task.count({ where: { status: 'BLOCKED' } });

    let myTasksCount = 0;
    if (userId) {
      myTasksCount = await prisma.task.count({ where: { assignedToId: userId } });
    }

    return {
      totalTasks: total,
      pendingTasks: pending,
      inProgressTasks: inProgress,
      completedTasks: completed,
      blockedTasks: blocked,
      myTasks: myTasksCount
    };
  },

  async getOverdueCount() {
    const now = new Date();
    return await prisma.task.count({
      where: {
        dueDate: {
          lt: now
        },
        status: {
          not: 'COMPLETED'
        }
      }
    });
  },

  async getStatusDistribution() {
    const distribution = await prisma.task.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    return distribution.map((item) => ({
      status: item.status,
      count: item._count.status
    }));
  },

  async getPriorityDistribution() {
    const distribution = await prisma.task.groupBy({
      by: ['priority'],
      _count: {
        priority: true
      }
    });

    return distribution.map((item) => ({
      priority: item.priority,
      count: item._count.priority
    }));
  },

  async getRecentTasks() {
    return await prisma.task.findMany({
      take: 5,
      orderBy: {
        updatedAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        updatedAt: true,
        assignee: true
      }
    });
  },

  async getUpcomingTasks() {
    const now = new Date();
    // Normalize to today's start in UTC/local depending on server current time
    return await prisma.task.findMany({
      take: 5,
      where: {
        dueDate: {
          gte: now
        },
        status: {
          not: 'COMPLETED'
        }
      },
      orderBy: {
        dueDate: 'asc'
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        priority: true,
        assignee: true
      }
    });
  },

  async getMyTasks(userId) {
    if (!userId) return [];

    return await prisma.task.findMany({
      take: 5,
      where: {
        assignedToId: userId
      },
      orderBy: {
        updatedAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        updatedAt: true
      }
    });
  }
};

export default dashboardRepository;
