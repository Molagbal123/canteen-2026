import { User } from '../models/index.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AuthenticationError, ConflictError, ValidationError } from '../utils/errors.js';

export const register = async ({ name, email, password, phone, address }) => {
  if (!name || !email || !password) {
    throw new ValidationError('Name, email, and password are required');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) {
    throw new ConflictError('Tài khoản này đã tồn tại');
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password,
    phone: String(phone || '').trim(),
    address: String(address || '').trim(),
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: user.toSafeJSON(),
    accessToken,
    refreshToken,
  };
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new ValidationError('Tài khoản và mật khẩu là bắt buộc');
  }

  const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
  if (!user) {
    throw new AuthenticationError('Tài khoản hoặc mật khẩu không hợp lệ');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AuthenticationError('Tài khoản hoặc mật khẩu không hợp lệ');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: user.toSafeJSON(),
    accessToken,
    refreshToken,
  };
};

export const refresh = async (token) => {
  if (!token) {
    throw new AuthenticationError('Refresh token is required');
  }

  const decoded = verifyRefreshToken(token);
  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  const accessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken: newRefreshToken };
};
