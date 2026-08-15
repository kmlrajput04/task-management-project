import prisma from '../config/prisma.js';

export const notificationsRepository = {
  async findMany(userId) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async create(data) {
    return await prisma.notification.create({ data });
  },

  async update(id, data) {
    return await prisma.notification.update({
      where: { id },
      data
    });
  },

  async markAllRead(userId) {
    return await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
  },

  async deleteOlderThan(date) {
    return await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: date
        }
      }
    });
  }
};

export default notificationsRepository;
