import BaseRepository from './base.repository.js';

export class ActivityRepository extends BaseRepository {
  constructor() {
    super('activityLog');
  }

  async findByTaskId(taskId) {
    return await this.model.findMany({
      where: { taskId },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });
  }
}

export const activityRepository = new ActivityRepository();
export default activityRepository;
