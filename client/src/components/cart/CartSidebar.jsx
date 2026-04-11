import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './CartSidebar.module.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

const CartSidebar = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  return (
    <>
      <div className={styles.overlay} onClick={() => setIsCartOpen(false)} />
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Giỏ Hàng
            {totalItems > 0 && <span className={styles.itemCount}>({totalItems} món)</span>}
          </h2>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.emptyCart}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p>Giỏ hàng của bạn đang trống</p>
          </div>
        ) : (
          <>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <img
                    className={styles.cartItemImage}
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = `https://placehold.co/128x128/f1f3f6/9ca3af?text=${encodeURIComponent(item.name)}`;
                    }}
                  />
                  <div className={styles.cartItemInfo}>
                    <span className={styles.cartItemName}>{item.name}</span>
                    <span className={styles.cartItemPrice}>{formatPrice(item.price)}</span>
                    <div className={styles.cartItemControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Tổng Cộng</span>
                <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
              </div>
              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                Tiến Hành Thanh Toán
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
