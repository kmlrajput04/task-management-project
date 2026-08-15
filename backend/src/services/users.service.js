import BaseService from './base.service.js';
import usersRepository from '../repositories/users.repository.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';
import { getPaginationMeta } from '../utils/pagination.js';
import bcrypt from 'bcryptjs';

export class UsersService extends BaseService {
  constructor() {
    super(usersRepository, 'User');
  }

  async getUsers(params) {
    const { page, limit, skip, search, sortBy, sortOrder } = params;

    const { data, total } = await usersRepository.findMany({
      skip,
      limit,
      search,
      sortBy,
      sortOrder
    });

    const meta = getPaginationMeta(total, page, limit);

    return { data, meta };
  }

  async getUserById(id) {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  }

  async createUser(data) {
    // Validate uniqueness of email
    const existingUser = await usersRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError(`Email ${data.email} is already in use`);
    }

    const cleanName = (data.name || '').replace(/\s+/g, '').toLowerCase();
    if (cleanName.length < 4) {
      throw new ConflictError('Name must be at least 4 characters long');
    }

    const cleanPhone = (data.phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 4) {
      throw new ConflictError('Phone number is required and must have at least 4 digits to generate the password');
    }

    // Generate custom password
    // Rule: first 4 letters of name + last 4 digits of phone number
    const namePart = cleanName.substring(0, 4).padEnd(4, 'x');
    const phonePart = cleanPhone.substring(Math.max(0, cleanPhone.length - 4)).padStart(4, '0');

    const plainPassword = namePart + phonePart;

    // Hash the generated password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    const userData = {
      ...data,
      passwordHash
    };

    return await usersRepository.create(userData);
  }

  async updateUser(id, data) {
    // Validate user existence
    await this.checkExistence(id);

    // Validate uniqueness of email (if being updated)
    if (data.email) {
      const existingUser = await usersRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictError(`Email ${data.email} is already in use by another user`);
      }
    }

    return await usersRepository.update(id, data);
  }

  async deleteUser(id) {
    // Validate user existence
    await this.checkExistence(id);

    // TODO: Prevent deletion if tasks are assigned to this user.
    // This will be implemented in future phases (e.g. check if task count > 0).

    return await usersRepository.delete(id);
  }
}

export const usersService = new UsersService();
export default usersService;
