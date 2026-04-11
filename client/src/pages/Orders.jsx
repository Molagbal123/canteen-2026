import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './Orders.module.css';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const statusMap = {
  pending: { label: 'Đang chờ', className: 'badge badge-pending' },
  cooking: { label: 'Đang chuẩn bị', className: 'badge badge-cooking' },
  delivering: { label: 'Đang giao', className: 'badge badge-delivering' },
  done: { label: 'Hoàn thành', className: 'badge badge-done' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getUserOrders();
        setOrders(res.data);
      } catch (err) {
        setError(err.message || 'Lấy danh sách đơn hàng thất bại');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return '';
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.ordersPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="section-title">Đơn Hàng Của Tôi</h1>
          <p className="section-subtitle">Theo dõi trạng thái các đơn hàng gần đây của bạn</p>
        </div>

        {error ? (
          <div className="empty-state">
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Lịch sử đơn hàng sẽ hiển thị ở đây</p>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order, idx) => {
              const isExpanded = expandedId === order.id;
              const status = statusMap[order.status] || statusMap.pending;

              return (
                <div key={order.id} className={`${styles.orderCard} stagger-item`} style={{ '--i': idx }}>
                  <div
                    className={styles.orderHeader}
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div className={styles.orderMeta}>
                      <span className={styles.orderId}>#{orders.length - idx}</span>
                      <span className={styles.orderDate}>{formatDate(order.createdAt || order.created_at)}</span>
                      <span className={status.className}>{status.label}</span>
                    </div>
                    <div className={styles.orderRight}>
                      <span className={styles.orderTotal}>{formatPrice(order.total_price)}</span>
                      <svg
                        className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {isExpanded && order.items && (
                    <div className={styles.orderItems}>
                      {order.items.map((item) => (
                        <div key={item.id} className={styles.itemRow}>
                          <img
                            className={styles.itemImage}
                            src={getImageUrl(item.food?.image)}
                            alt={item.food?.name || 'Món'}
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/88x88/f1f3f6/9ca3af?text=Món';
                            }}
                          />
                          <span className={styles.itemName}>{item.food?.name || 'Món không xác định'}</span>
                          <span className={styles.itemQty}>x{item.quantity}</span>
                          <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
