import { useContext } from 'react';
import ToastStateContext from './ToastStateContext';

export const useToast = () => {
  const context = useContext(ToastStateContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
