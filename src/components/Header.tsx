import { Link } from 'react-router-dom';
import { nav, site } from '../data/site';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link to="/">
          <img
            src="/assets/elsabr-logo.png"
            alt={site.name}
            className={styles.logo}
            width={183}
            height={52}
          />
        </Link>
        <span className={styles.tagline}>{site.tagline}</span>
      </div>

      <nav className={styles.nav} aria-label="روابط الموقع">
        {nav.map((item) =>
          item.kind === 'route' ? (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ) : (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ),
        )}
      </nav>

      <div className={styles.actions}>
        <a href={site.phoneHref} className={styles.phone}>
          <span className={styles.pip} aria-hidden="true" />
          <bdi>{site.phoneDisplay}</bdi>
        </a>
        <a href="#quote" className={styles.cta}>
          اطلب عرض سعر
        </a>
      </div>
    </header>
  );
}
