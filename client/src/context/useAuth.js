import { useContext } from 'react';
import AuthStateContext from './AuthStateContext';

export const useAuth = () => {
  const context = useContext(AuthStateContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
