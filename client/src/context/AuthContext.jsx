import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await authAPI.getMe();
      setUser(res.data);
    } catch (error) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    const { user: userData, accessToken } = res.data;
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
    return userData;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const { user: userData, accessToken } = res.data;
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
    return userData;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // ignore
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('accessToken');
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
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
