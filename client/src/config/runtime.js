export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const apiUrl = new URL(API_BASE_URL, window.location.origin);
export const REALTIME_URL = import.meta.env.VITE_REALTIME_URL || apiUrl.origin;
export const ASSET_BASE_URL = import.meta.env.VITE_ASSET_URL || apiUrl.origin;
