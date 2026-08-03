import { useContext } from 'react';
import CartStateContext from './CartStateContext';

export const useCart = () => {
  const context = useContext(CartStateContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
