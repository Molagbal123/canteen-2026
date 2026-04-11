import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <div className={styles.sidebarWrap}>
        <AdminSidebar />
      </div>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
