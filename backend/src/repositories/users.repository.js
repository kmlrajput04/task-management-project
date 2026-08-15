import BaseRepository from './base.repository.js';
import prisma from '../config/prisma.js';

export class UsersRepository extends BaseRepository {
  constructor() {
    super('user');
  }

  async findByEmail(email) {
    return await this.model.findUnique({
      where: { email }
    });
  }

  async findMany({ skip, limit, search, sortBy, sortOrder }) {
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const orderBy = {
      [sortBy]: sortOrder
    };

    const [data, total] = await prisma.$transaction([
      this.model.findMany({
        skip,
        take: limit,
        where,
        orderBy
      }),
      this.model.count({ where })
    ]);

    return { data, total };
  }
}

export const usersRepository = new UsersRepository();
export default usersRepository;
