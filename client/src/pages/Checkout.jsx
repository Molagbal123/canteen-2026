import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import { useToast } from '../components/common/useToast';
import { orderAPI } from '../services/api';
import styles from './Checkout.module.css';
import { getAssetUrl } from '../utils/assets';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const requestId = useRef(
    globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    customerAddress: user?.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setLoading(true);
    try {
      await orderAPI.create({
        items: items.map((item) => ({
          foodId: item.id,
          quantity: item.quantity,
        })),
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerAddress: form.customerAddress,
        requestId: requestId.current,
      });
      clearCart();
      setShowSuccess(true);
    } catch (err) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h3>Giỏ hàng trống</h3>
            <p>Hãy thêm món ăn trước khi thanh toán</p>
            <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>Xem Thực Đơn</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 24 }}>Thanh Toán</h1>

        <div className={styles.checkoutGrid}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Thông tin giao hàng</h2>
            <form className={styles.deliveryForm} onSubmit={handleSubmit} id="checkout-form">
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-name">Họ và Tên</label>
                <input
                  id="checkout-name"
                  className="form-input"
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkout-phone">Số điện thoại</label>
                <input
                  id="checkout-phone"
                  className="form-input"
                  type="tel"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkout-address">Địa chỉ phòng</label>
                <input
                  id="checkout-address"
                  className="form-input"
                  type="text"
                  name="customerAddress"
                  value={form.customerAddress}
                  onChange={handleChange}
                  required
                  placeholder="Vd. Phòng B2-305, Tòa B"
                />
              </div>
            </form>
          </div>

          <div className={`${styles.section} ${styles.orderSummary}`}>
            <h2 className={styles.sectionTitle}>Tóm Tắt Đơn Hàng</h2>

            <div className={styles.summaryItems}>
              {items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <img
                    className={styles.summaryItemImage}
                    src={getAssetUrl(item.image)}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = `https://placehold.co/96x96/f1f3f6/9ca3af?text=${encodeURIComponent(item.name)}`;
                    }}
                  />
                  <div className={styles.summaryItemInfo}>
                    <p className={styles.summaryItemName}>{item.name}</p>
                    <p className={styles.summaryItemQty}>SL: {item.quantity}</p>
                  </div>
                  <span className={styles.summaryItemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Tổng Cộng</span>
              <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
            </div>

            <button
              className={styles.placeOrderBtn}
              type="submit"
              form="checkout-form"
              disabled={loading}
            >
              {loading ? 'Đang Đặt Hàng...' : 'Đặt Hàng'}
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className={styles.successOverlay}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Đặt Hàng Thành Công!</h2>
            <p className={styles.successText}>
              Đơn hàng của bạn đã được tiếp nhận và đang được chuẩn bị.
              Bạn có thể theo dõi trạng thái ở trang Đơn Hàng.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>
              Xem Đơn Hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
