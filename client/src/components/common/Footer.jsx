import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <span className={styles.footerBrand}>Canteen</span>
        <span className={styles.footerText}>
          Hệ Thống Đặt Đồ Ăn Canteen VKU
        </span>
      </div>
    </footer>
  );
};

export default Footer;
