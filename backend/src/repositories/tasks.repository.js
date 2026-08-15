import BaseRepository from './base.repository.js';
import prisma from '../config/prisma.js';

export class TasksRepository extends BaseRepository {
  constructor() {
    super('task');
  }

  async findById(id) {
    return await this.model.findUnique({
      where: { id },
      include: {
        creator: true,
        assignee: true
      }
    });
  }

  async findMany({ skip, limit, search, status, priority, assignee, sortBy, sortOrder }) {
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (assignee) {
      where.assignedToId = assignee;
    }

    const orderBy = {
      [sortBy]: sortOrder
    };

    const [data, total] = await prisma.$transaction([
      this.model.findMany({
        skip,
        take: limit,
        where,
        orderBy,
        include: {
          creator: true,
          assignee: true
        }
      }),
      this.model.count({ where })
    ]);

    return { data, total };
  }
}

export const tasksRepository = new TasksRepository();
export default tasksRepository;
