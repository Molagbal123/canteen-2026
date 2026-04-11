import { catchAsync } from '../utils/catch-async.js';
import * as authService from '../services/auth.service.js';

const setTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  setTokenCookie(res, refreshToken);
  res.status(201).json({ success: true, data: { user, accessToken } });
});

export const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setTokenCookie(res, refreshToken);
  res.status(200).json({ success: true, data: { user, accessToken } });
});

export const logout = catchAsync(async (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  const { accessToken, refreshToken: newRefresh } = await authService.refresh(token);
  setTokenCookie(res, newRefresh);
  res.status(200).json({ success: true, data: { accessToken } });
});

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});
