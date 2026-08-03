import { Fragment, useState, useEffect, useCallback } from 'react';
import { orderAPI } from '../../services/api';
import { useToast } from '../../components/common/useToast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './OrderManagement.module.css';
import { useRealtime } from '../../context/useRealtime';
import { getAssetUrl } from '../../utils/assets';

const nextStatus = {
  pending: 'cooking',
  cooking: 'delivering',
  delivering: 'done',
};

const statusLabels = {
  pending: 'Đang chờ',
  cooking: 'Đang chuẩn bị',
  delivering: 'Đang giao',
  done: 'Hoàn thành',
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const { showToast } = useToast();
  const { socket } = useRealtime();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getAllOrders({ page, limit: 15 });
      setOrders(res.data);
      setPagination(res.pagination);
    } catch {
      showToast('Lấy danh sách đơn hàng thất bại', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleCreated = () => fetchOrders();
    const handleUpdated = (updatedOrder) => {
      setOrders((current) => current.map((order) =>
        order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
      ));
    };

    socket.on('order:created', handleCreated);
    socket.on('order:status-updated', handleUpdated);
    socket.on('connect', fetchOrders);
    return () => {
      socket.off('order:created', handleCreated);
      socket.off('order:status-updated', handleUpdated);
      socket.off('connect', fetchOrders);
    };
  }, [fetchOrders, socket]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      showToast('Đã cập nhật trạng thái', 'success');
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      showToast(err.message || 'Cập nhật trạng thái thất bại', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.ordersPage}>
      <h1 className={styles.pageTitle}>Quản Lý Đơn Hàng</h1>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Mã Đơn</th>
              <th>Khách Hàng</th>
              <th>Tổng Cộng</th>
              <th>Trạng Thái</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isExpanded = expandedId === order.id;
              return (
                <Fragment key={order.id}>
                  <tr>
                    <td>
                      <button
                        className={styles.expandBtn}
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      >
                        <svg
                          width="16" height="16"
                          className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>#{order.id}</td>
                    <td>
                      <div>{order.user?.name || order.customer_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatPrice(order.total_price)}</td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value={order.status}>{statusLabels[order.status]}</option>
                        {nextStatus[order.status] && (
                          <option value={nextStatus[order.status]}>{statusLabels[nextStatus[order.status]]}</option>
                        )}
                      </select>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{formatDate(order.createdAt || order.created_at)}</td>
                  </tr>
                  {isExpanded && order.items && (
                    <tr key={`${order.id}-items`} className={styles.expandedRow}>
                      <td colSpan="6">
                        <div className={styles.orderItemsList}>
                          {order.items.map((item) => (
                            <div key={item.id} className={styles.orderItem}>
                              <img
                                className={styles.itemThumb}
                                src={getAssetUrl(item.food_image || item.food?.image)}
                                alt={item.food_name || item.food?.name || 'Item'}
                                onError={(e) => { e.target.src = 'https://placehold.co/72x72/f1f3f6/9ca3af?text=Food'; }}
                              />
                              <span className={styles.itemName}>{item.food_name || item.food?.name || 'Món không xác định'}</span>
                              <span className={styles.itemDetail}>x{item.quantity}</span>
                              <span className={styles.itemDetail}>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="empty-state" style={{ padding: '40px' }}>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Đơn hàng sẽ hiển thị ở đây khi khách đặt</p>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
            >
              Trước
            </button>
            <span className={styles.pageInfo}>
              Trang {pagination.page} trên {pagination.totalPages}
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.totalPages}
            >
              Tiếp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
