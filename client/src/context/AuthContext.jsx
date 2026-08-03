import { useState, useEffect, useCallback } from 'react';
import { authAPI, setApiAccessToken } from '../services/api';
import AuthStateContext from './AuthStateContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    setApiAccessToken(null);
  }, []);

  const bootstrapSession = useCallback(async () => {
    try {
      localStorage.removeItem('accessToken');
      const refreshResponse = await authAPI.refreshToken();
      const { accessToken } = refreshResponse.data;
      setApiAccessToken(accessToken);
      setToken(accessToken);
      const res = await authAPI.getMe();
      setUser(res.data);
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  useEffect(() => {
    const handleTokenRefresh = (event) => {
      setApiAccessToken(event.detail);
      setToken(event.detail);
    };
    window.addEventListener('auth:token-refreshed', handleTokenRefresh);
    return () => window.removeEventListener('auth:token-refreshed', handleTokenRefresh);
  }, []);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    const { user: userData, accessToken } = res.data;
    setApiAccessToken(accessToken);
    setUser(userData);
    setToken(accessToken);
    return userData;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const { user: userData, accessToken } = res.data;
    setApiAccessToken(accessToken);
    setUser(userData);
    setToken(accessToken);
    return userData;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    }
    clearSession();
  };

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  );
};
