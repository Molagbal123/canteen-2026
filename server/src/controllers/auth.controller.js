import { catchAsync } from '../utils/catch-async.js';
import * as authService from '../services/auth.service.js';
import { getRefreshCookieOptions } from '../config/runtime.js';

const setTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, getRefreshCookieOptions());
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
  const { maxAge, ...cookieOptions } = getRefreshCookieOptions();
  res.clearCookie('refreshToken', cookieOptions);
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
