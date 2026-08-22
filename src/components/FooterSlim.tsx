import { Link } from 'react-router-dom';
import { site } from '../data/site';
import styles from './FooterSlim.module.css';

/** Condensed footer used on the catalog, matching the design. */
export function FooterSlim() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>
          © {new Date().getFullYear()} {site.name} {site.tagline}
        </span>
        <span>مناطق الخدمة: {site.serviceAreas}</span>
        <Link to="/">الرجوع للرئيسية</Link>
      </div>
    </footer>
  );
}
