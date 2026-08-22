import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { site } from '../data/site';
import { CartButton } from './CartButton';
import styles from './Header.module.css';

const SECTIONS = [
  { label: 'ليه الصبر', hash: '#why' },
  { label: 'إزاي بنشتغل', hash: '#how' },
  { label: 'بنحل إيه', hash: '#problems' },
  { label: 'مين إحنا', hash: '#team' },
];

export function Header() {
  const { pathname } = useLocation();
  const { lineCount } = useCart();
  const onHome = pathname === '/';
  const onCatalog = pathname === '/catalog';

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
        {onCatalog ? (
          <Link to="/">الرئيسية</Link>
        ) : (
          <Link to="/catalog">الكتالوج</Link>
        )}

        {/* Section links are anchors on the home page, real navigations elsewhere. */}
        {SECTIONS.map((s) =>
          onHome ? (
            <a key={s.hash} href={s.hash}>
              {s.label}
            </a>
          ) : (
            <Link key={s.hash} to={`/${s.hash}`}>
              {s.label}
            </Link>
          ),
        )}

        {onCatalog && <span className={styles.current}>الكتالوج</span>}
      </nav>

      <div className={styles.actions}>
        <a href={site.phoneHref} className={styles.phone}>
          <span className={styles.pip} aria-hidden="true" />
          <bdi>{site.phoneDisplay}</bdi>
        </a>

        {/* Always available on the catalog; elsewhere only once it has something,
            so a cart started on the catalog is never stranded. */}
        {(onCatalog || lineCount > 0) && <CartButton />}

        {onHome ? (
          <a href="#quote" className={styles.cta}>
            اطلب عرض سعر
          </a>
        ) : (
          <Link to="/#quote" className={styles.cta}>
            اطلب عرض سعر
          </Link>
        )}
      </div>
    </header>
  );
}
