import { site } from '../data/site';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <img
            src="/assets/elsabr-logo-light.png"
            alt={site.name}
            className={styles.logo}
            width={225}
            height={64}
          />
          <p className={styles.blurb}>
            مورّد مستلزمات المكاتب والتشغيل للشركات والجهات في مصر.
          </p>
        </div>

        <div className={styles.cols}>
          <nav className={styles.col} aria-label="روابط الموقع في التذييل">
            <span className={styles.colHead}>الموقع</span>
            <a href="#products">المنتجات</a>
            <a href="#why">ليه الصبر</a>
            <a href="#how">إزاي بنشتغل</a>
            <a href="#team">مين إحنا</a>
          </nav>

          <div className={styles.col}>
            <span className={styles.colHead}>تواصل</span>
            <a href={site.phoneHref}>
              <bdi>{site.phoneDisplay}</bdi>
            </a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>{site.city}</span>
            <span className={`${styles.colHead} ${styles.spaced}`}>مناطق الخدمة</span>
            <span>{site.serviceAreas}</span>
          </div>
        </div>
      </div>

      <div className={styles.legal}>
        © {new Date().getFullYear()} {site.name} {site.tagline}
      </div>
    </footer>
  );
}
