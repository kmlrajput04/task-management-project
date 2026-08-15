import bcrypt from 'bcryptjs';
import authRepository from '../repositories/auth.repository.js';
import { generateToken } from '../utils/jwt.js';
import { UnauthorizedError, NotFoundError } from '../utils/errors.js';

export const authService = {
  async login(email, password) {
    // 1. Fetch user by email
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // 2. Verify hashed password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // 3. Generate JWT access token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // 4. Return token and user profile details (omitting passwordHash)
    const { passwordHash, ...userProfile } = user;

    return {
      token,
      user: userProfile
    };
  },

  async getUserProfile(userId) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    const { passwordHash, ...userProfile } = user;
    return userProfile;
  }
};

export default authService;
