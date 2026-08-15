import { userRepository } from '../repositories/user.repository.js';

export const userService = {
  async getAllUsers(params) {
    return await userRepository.findAll(params);
  },

  async getUserById(id) {
    return await userRepository.findById(id);
  },

  async createUser(data) {
    return await userRepository.create(data);
  },

  async updateUser(id, data) {
    return await userRepository.update(id, data);
  },

  async deleteUser(id) {
    return await userRepository.delete(id);
  }
};
