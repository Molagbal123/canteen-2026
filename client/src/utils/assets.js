import { ASSET_BASE_URL } from '../config/runtime';

export const getAssetUrl = (path) => {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return new URL(path, `${ASSET_BASE_URL}/`).href;
};
