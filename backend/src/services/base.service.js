import { NotFoundError } from '../utils/errors.js';

export class BaseService {
  constructor(repository, entityName = 'Record') {
    this.repository = repository;
    this.entityName = entityName;
  }

  async checkExistence(id) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundError(`${this.entityName} with ID ${id} not found`);
    }
    return record;
  }

  // Wrapper for executing service operations safely
  async execute(operation) {
    try {
      return await operation();
    } catch (error) {
      throw error;
    }
  }
}
export default BaseService;
