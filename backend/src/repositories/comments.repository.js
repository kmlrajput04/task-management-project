import BaseRepository from './base.repository.js';

export class CommentsRepository extends BaseRepository {
  constructor() {
    super('comment');
  }

  async findByTaskId(taskId) {
    return await this.model.findMany({
      where: { taskId },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
  }
}

export const commentsRepository = new CommentsRepository();
export default commentsRepository;
