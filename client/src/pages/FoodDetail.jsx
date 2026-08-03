import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foodAPI } from '../services/api';
import { useCart } from '../context/useCart';
import { useToast } from '../components/common/useToast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './FoodDetail.module.css';
import { getAssetUrl } from '../utils/assets';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const res = await foodAPI.getById(id);
        setFood(res.data);
      } catch (err) {
        setError(err.message || 'Không tìm thấy món ăn');
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(food);
    }
    showToast(`Đã thêm ${quantity}x ${food.name} vào giỏ hàng`, 'success');
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <h3>Không tìm thấy món</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>Trở về Thực Đơn</button>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getAssetUrl(food.image);

  return (
    <div className={styles.detailPage}>
      <div className="container">
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Quay Lại
        </button>

        <div className={styles.content}>
          <div className={styles.imageWrap}>
            <img
              className={styles.image}
              src={imageUrl}
              alt={food.name}
              onError={(e) => {
                e.target.src = `https://placehold.co/800x600/f1f3f6/9ca3af?text=${encodeURIComponent(food.name)}`;
              }}
            />
          </div>

          <div className={styles.info}>
            <span className={styles.category}>{food.category}</span>
            <h1 className={styles.name}>{food.name}</h1>
            <p className={styles.description}>{food.description}</p>

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(food.price)}</span>
            </div>

            <div className={styles.actions}>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <button className={styles.addBtn} onClick={handleAddToCart}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Thêm vào giỏ — {formatPrice(food.price * quantity)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
