import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import StatsCard from '../../components/admin/StatsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './Dashboard.module.css';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const statusMap = {
  pending: { label: 'Đang chờ', class: 'badge badge-pending' },
  cooking: { label: 'Đang chuẩn bị', class: 'badge badge-cooking' },
  delivering: { label: 'Đang giao', class: 'badge badge-delivering' },
  done: { label: 'Hoàn thành', class: 'badge badge-done' },
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await orderAPI.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy thống kê:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>Bảng Điều Khiển</h1>

      <div className={styles.statsGrid}>
        <StatsCard
          label="Tổng Đơn Hàng"
          value={stats?.totalOrders || 0}
          color="#0d9488"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
          }
        />
        <StatsCard
          label="Tổng Doanh Thu"
          value={formatPrice(stats?.totalRevenue || 0)}
          color="#16a34a"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <StatsCard
          label="Đơn Chờ"
          value={stats?.pendingOrders || 0}
          color="#f59e0b"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
        <StatsCard
          label="Tổng Số Món"
          value={stats?.totalFoods || 0}
          color="#6366f1"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            </svg>
          }
        />
      </div>

      <div className={styles.recentSection}>
        <h2 className={styles.recentHeader}>Đơn Hàng Gần Đây</h2>
        {stats?.recentOrders?.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách Hàng</th>
                <th>Tổng Cộng</th>
                <th>Trạng Thái</th>
                <th>Ngày</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>#{order.id}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatPrice(order.total_price)}</td>
                  <td><span className={statusMap[order.status]?.class}>{statusMap[order.status]?.label}</span></td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{formatDate(order.createdAt || order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state" style={{ padding: '40px 24px' }}>
            <p>Chưa có đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
