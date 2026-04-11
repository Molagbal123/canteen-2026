import styles from './StatsCard.module.css';

const StatsCard = ({ icon, label, value, color = 'var(--color-accent)' }) => {
  return (
    <div className={styles.card}>
      <div
        className={styles.iconWrap}
        style={{ background: `${color}12`, color }}
      >
        {icon}
      </div>
      <div className={styles.info}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  );
};

export default StatsCard;
