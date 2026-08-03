import 'dotenv/config';

const DEFAULT_CLIENT_URL = 'http://localhost:5173';

export const getClientOrigins = () =>
  (process.env.CLIENT_URL || DEFAULT_CLIENT_URL)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || getClientOrigins().includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
};

export const getRefreshCookieOptions = () => {
  const sameSite = process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax');
  const secure = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === 'true'
    : process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
};

export const validateRuntimeEnv = () => {
  const required = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
  ];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
