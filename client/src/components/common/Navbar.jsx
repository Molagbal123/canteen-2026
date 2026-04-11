import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowMobile(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
            </span>
            Canteen
          </Link>

          <div className={styles.navLinks}>
            {!isAdminRoute && (
              <>
                <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
                  Thực Đơn
                </Link>
                {isAuthenticated && (
                  <Link to="/orders" className={`${styles.navLink} ${isActive('/orders') ? styles.active : ''}`}>
                    Đơn Hàng
                  </Link>
                )}
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className={`${styles.navLink} ${isActive('/admin') || location.pathname.startsWith('/admin') ? styles.active : ''}`}>
                Quản Trị
              </Link>
            )}
          </div>

          <div className={styles.navActions}>
            {!isAdminRoute && (
              <button className={styles.cartBtn} onClick={toggleCart} aria-label="Cart">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
              </button>
            )}

            {isAuthenticated ? (
              <div className={styles.userMenu} ref={dropdownRef}>
                <button
                  className={styles.userBtn}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className={styles.userAvatar}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                  <span>{user?.name?.split(' ')[0]}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {showDropdown && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownItem} style={{ pointerEvents: 'none', opacity: 0.6, fontSize: '0.8rem' }}>
                      {user?.email}
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link to="/orders" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      Đơn Hàng Của Tôi
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        Bảng Điều Khiển
                      </Link>
                    )}
                    <div className={styles.dropdownDivider} />
                    <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authLinks}>
                <Link to="/login" className={styles.loginLink}>Đăng Nhập</Link>
                <Link to="/register" className={styles.registerLink}>Đăng Ký</Link>
              </div>
            )}

            <button className={styles.mobileToggle} onClick={() => setShowMobile(!showMobile)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {showMobile ? (
                  <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                ) : (
                  <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {showMobile && (
        <div className={styles.mobileMenu}>
          {!isAdminRoute && (
            <>
              <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>Thực Đơn</Link>
              {isAuthenticated && (
                <Link to="/orders" className={`${styles.navLink} ${isActive('/orders') ? styles.active : ''}`}>Đơn Hàng Của Tôi</Link>
              )}
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className={`${styles.navLink} ${isActive('/admin') ? styles.active : ''}`}>Bảng Điều Khiển</Link>
          )}
          {!isAuthenticated && (
            <div className="mobileAuthLinks">
              <Link to="/login" className={styles.navLink}>Đăng Nhập</Link>
              <Link to="/register" className={styles.navLink}>Đăng Ký</Link>
            </div>
          )}
          {isAuthenticated && (
            <button className={`${styles.navLink}`} onClick={handleLogout} style={{ textAlign: 'left', color: 'var(--color-danger)' }}>
              Đăng Xuất
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
