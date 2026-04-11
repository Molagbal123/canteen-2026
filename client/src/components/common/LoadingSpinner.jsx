import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ text = 'Loading...', variant = 'spinner' }) => {
  if (variant === 'skeleton') {
    return (
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={`${styles.skeletonImage} skeleton`} />
            <div className={styles.skeletonBody}>
              <div className={`${styles.skeletonLine} skeleton`} />
              <div className={`${styles.skeletonLineShort} skeleton`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.spinnerWrap}>
      <div className={styles.spinner} />
      <span className={styles.spinnerText}>{text}</span>
    </div>
  );
};

export default LoadingSpinner;
