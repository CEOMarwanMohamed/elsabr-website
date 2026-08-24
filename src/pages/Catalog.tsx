import { useEffect, useMemo, useState } from 'react';
import { whatsappChatUrl } from '../cart/order';
import { ProductCard } from '../components/ProductCard';
import { catalog } from '../data/catalog';
import { site } from '../data/site';
import styles from './Catalog.module.css';

function initialTab(): string {
  const hash = window.location.hash.replace('#', '');
  return catalog.some((s) => s.id === hash) ? hash : catalog[0].id;
}

export default function Catalog() {
  const whatsapp = whatsappChatUrl();
  const [tab, setTab] = useState(initialTab);
  const [onlyStock, setOnlyStock] = useState(false);

  // Keep the hash in step with the active tab, as the design did.
  useEffect(() => {
    window.history.replaceState(null, '', `#${tab}`);
  }, [tab]);

  // ...and follow the hash when it changes underneath us — the back button, a
  // pasted link, or an edited address bar. Without this the URL and the visible
  // tab drift apart.
  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.replace('#', '');
      if (catalog.some((s) => s.id === id)) setTab(id);
    };
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const section = catalog.find((s) => s.id === tab) ?? catalog[0];

  // No price sort: prices are never shown, and the ones in the catalogue data
  // are demo values — sorting by an invisible placeholder misleads more than
  // it helps. Bring it back when real prices are on the cards.
  const products = useMemo(
    () => (onlyStock ? section.products.filter((p) => p.inStock) : section.products),
    [section, onlyStock],
  );

  return (
    <>
      <section className={styles.intro}>
        <div className="eyebrow">الكتالوج</div>
        <h1 className={styles.title}>
          الأصناف والأسعار،
          <br />
          من غير ما تسأل حد.
        </h1>
        <p className={styles.lede}>
          السعر بينزل كل ما الكمية تكبر، والشرايح مكتوبة جانب كل صنف. لو الكمية أكبر من
          الشريحة الأخيرة، كلمنا وهنعملك سعر خاص.
        </p>
        <div className={styles.notice}>
          <span className={styles.noticeDot} aria-hidden="true" />
          الأصناف والأسعار المعروضة تجريبية للتصور، لحد ما تبعت بيانات المنتجات الحقيقية.
        </div>
      </section>

      <div className={styles.controls}>
        <div className={styles.controlsInner}>
          <div className={styles.tabs} role="tablist" aria-label="أقسام الكتالوج">
            {catalog.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={s.id === tab}
                className={`${styles.tab} ${s.id === tab ? styles.tabOn : ''}`}
                onClick={() => setTab(s.id)}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className={styles.filters}>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={onlyStock}
                onChange={(e) => setOnlyStock(e.target.checked)}
              />
              المتوفر حالاً بس
            </label>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <p className={styles.sectionBlurb}>{section.blurb}</p>
          </div>
          <div className={styles.count}>{products.length} صنف معروض</div>
        </div>

        {products.length === 0 ? (
          <p className={styles.none}>مفيش أصناف متوفرة حالاً في القسم ده.</p>
        ) : (
          <div className={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.code} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <div style={{ maxWidth: 640 }}>
            <h2 className={styles.ctaTitle}>كميتك أكبر من الشريحة الأخيرة؟</h2>
            <p className={styles.ctaBody}>
              كلمنا وهنعملك سعر خاص مكتوب، ثابت 30 يوم، مع مندوب واحد يتابع معاك كل
              الأقسام.
            </p>
          </div>
          <div className={styles.ctaActions}>
            {whatsapp && (
              <a
                className={styles.ctaPrimary}
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                واتساب
              </a>
            )}
            <a className={styles.ctaSecondary} href={site.phoneHref}>
              اتصل بينا
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
