import prisma from '../config/prisma.js';

export class BaseRepository {
  constructor(modelName) {
    this.modelName = modelName;
    this.model = prisma[modelName];
  }

  async findById(id, include = null) {
    return await this.model.findUnique({
      where: { id },
      ...(include && { include })
    });
  }

  async findOne(where, include = null) {
    return await this.model.findFirst({
      where,
      ...(include && { include })
    });
  }

  async create(data) {
    return await this.model.create({ data });
  }

  async update(id, data) {
    return await this.model.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return await this.model.delete({
      where: { id }
    });
  }

  async count(where = {}) {
    return await this.model.count({ where });
  }

  async findPaginated({ skip, limit, where = {}, orderBy = { createdAt: 'desc' }, include = null }) {
    const [data, total] = await prisma.$transaction([
      this.model.findMany({
        skip,
        take: limit,
        where,
        orderBy,
        ...(include && { include })
      }),
      this.model.count({ where })
    ]);

    return { data, total };
  }

  async transaction(fn) {
    return await prisma.$transaction(fn);
  }
}
export default BaseRepository;
