import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Tạo tài khoản</h1>
        <p className={styles.authSubtitle}>Tham gia và bắt đầu đặt bữa ăn của bạn</p>

        {error && <div className={styles.authError}>{error}</div>}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Họ và Tên</label>
            <input
              id="reg-name"
              className="form-input"
              type="text"
              name="name"
              placeholder="Họ và tên của bạn"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Mã Sinh Viên / Email</label>
            <input
              id="reg-email"
              className="form-input"
              type="text"
              name="email"
              placeholder="Ví dụ: lehoang.21it"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Mật khẩu</label>
            <input
              id="reg-password"
              className="form-input"
              type="password"
              name="password"
              placeholder="Ít nhất 6 ký tự"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">Số điện thoại</label>
            <input
              id="reg-phone"
              className="form-input"
              type="tel"
              name="phone"
              placeholder="0912 345 678"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-address">Địa chỉ phòng</label>
            <input
              id="reg-address"
              className="form-input"
              type="text"
              name="address"
              placeholder="Vd. Phòng B2-305, Tòa B"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <button className={styles.authSubmit} type="submit" disabled={loading}>
            {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký'}
          </button>
        </form>

        <p className={styles.authFooter}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
