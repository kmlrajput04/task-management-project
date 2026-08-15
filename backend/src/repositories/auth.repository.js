import BaseRepository from './base.repository.js';

export class AuthRepository extends BaseRepository {
  constructor() {
    super('user');
  }

  async findByEmail(email) {
    return await this.model.findUnique({
      where: { email }
    });
  }
}

export const authRepository = new AuthRepository();
export default authRepository;
