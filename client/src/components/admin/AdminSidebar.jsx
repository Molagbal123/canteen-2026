import { Link, useLocation } from 'react-router-dom';
import styles from './AdminSidebar.module.css';

const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.sidebar}>
      <span className={styles.sidebarTitle}>Quản Trị</span>

      <Link
        to="/admin"
        className={`${styles.sidebarLink} ${isActive('/admin') ? styles.active : ''}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
        Bảng Điều Khiển
      </Link>

      <Link
        to="/admin/foods"
        className={`${styles.sidebarLink} ${isActive('/admin/foods') ? styles.active : ''}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        </svg>
        Món Ăn
      </Link>

      <Link
        to="/admin/orders"
        className={`${styles.sidebarLink} ${isActive('/admin/orders') ? styles.active : ''}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        Đơn Hàng
      </Link>

    </nav>
  );
};

export default AdminSidebar;
