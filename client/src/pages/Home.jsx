import { useState, useEffect, useCallback } from 'react';
import { foodAPI } from '../services/api';
import FoodCard from '../components/food/FoodCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './Home.module.css';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await foodAPI.getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { limit: 50 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeCategory !== 'all') params.category = activeCategory;
      const res = await foodAPI.getAll(params);
      setFoods(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeCategory]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  return (
    <div className="page">
      <div className="container">
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Bữa ăn tươi ngon,<br />
              giao <span className={styles.heroAccent}>tận phòng</span>
            </h1>
            <p className={styles.heroDesc}>
              Khám phá thực đơn, chọn món yêu thích và nhận đồ ăn tại quầy Canteen.
            </p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.categories}>
            <button
              className={`${styles.catBtn} ${activeCategory === 'all' ? styles.active : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.catBtn} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner variant="skeleton" />
        ) : error ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchFoods} style={{ marginTop: 16 }}>Thử Lại</button>
          </div>
        ) : foods.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <h3>Không tìm thấy món ăn</h3>
            <p>Thử thay đổi từ khóa hoặc bộ lọc</p>
          </div>
        ) : (
          <>
            <p className={styles.resultsInfo}>Hiển thị {foods.length} món ăn</p>
            <div className={styles.grid}>
              {foods.map((food, i) => (
                <FoodCard key={food.id} food={food} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
