import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './FoodCard.module.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

const FoodCard = ({ food, index = 0 }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(food);
  };

  const imageUrl = food.image?.startsWith('http')
    ? food.image
    : `http://localhost:5000${food.image}`;

  return (
    <div
      className={`${styles.card} stagger-item`}
      style={{ '--i': index }}
      onClick={() => navigate(`/food/${food.id}`)}
    >
      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={imageUrl}
          alt={food.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/600x400/f1f3f6/9ca3af?text=Mon+An`;
          }}
        />
        <span className={styles.categoryTag}>{food.category}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{food.name}</h3>
        <div className={styles.bottom}>
          <span className={styles.price}>{formatPrice(food.price)}</span>
          <button
            className={styles.addBtn}
            onClick={handleAddToCart}
            aria-label={`Thêm ${food.name} vào giỏ hàng`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
