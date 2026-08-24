import { useEffect, useRef, useState } from 'react';
import { MAX_QTY, useCart } from '../cart/CartContext';
import { whatsappProductUrl } from '../cart/order';
import type { Product } from '../data/catalog';
import { QtyStepper } from './QtyStepper';
import styles from './ProductCard.module.css';

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  // The design's demo photos may not be present; fall back rather than
  // showing a broken image. Restoring the files makes photos appear again.
  const [imageOk, setImageOk] = useState(true);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Carries the quantity the customer dialled in, so the enquiry matches it.
  const askHref = product.inStock ? null : whatsappProductUrl(product, qty);

  const onAdd = () => {
    add(product, qty);
    setQty(1);
    setJustAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className={styles.card}>
      <div
        className={`${styles.media} ${
          product.image && imageOk ? '' : styles.mediaEmpty
        }`}
      >
        {product.image && imageOk ? (
          <img
            src={product.image}
            alt={product.imageAlt ?? product.name}
            loading="lazy"
            width={320}
            height={190}
            onError={() => setImageOk(false)}
          />
        ) : (
          <span aria-hidden="true">الصبر</span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.head}>
          <h3 className={styles.name}>{product.name}</h3>
          <span
            className={`${styles.badge} ${
              product.inStock ? styles.badgeIn : styles.badgeOrder
            }`}
          >
            {product.availability}
          </span>
        </div>

        <dl className={styles.meta}>
          <dt className={styles.metaKey}>الكود</dt>
          <dd className={styles.metaVal}>
            <bdi>{product.code}</bdi>
          </dd>
          <dt className={styles.metaKey}>المقاس</dt>
          <dd className={styles.metaVal}>{product.size}</dd>
          <dt className={styles.metaKey}>الوحدة</dt>
          <dd className={styles.metaVal}>{product.unit}</dd>
        </dl>

        <div className={styles.qtyRow}>
          <span className={styles.qtyLabel}>الكمية المطلوبة</span>
          <QtyStepper
            value={qty}
            onChange={(n) => setQty(Math.max(1, Math.min(MAX_QTY, n)))}
            label={product.name}
          />
        </div>

        <div className={styles.addWrap}>
          <button
            type="button"
            className={`${styles.add} ${justAdded ? styles.added : ''}`}
            onClick={onAdd}
          >
            {justAdded ? 'تمّت الإضافة ✓' : 'أضف للسلة'}
          </button>

          {/* Only on تحت الطلب items: asking is the useful action there. On
              stocked items a second WhatsApp button would just compete with
              the cart and split orders into one-off chats. */}
          {!product.inStock && askHref && (
            <a
              className={styles.ask}
              href={askHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              اسأل عنه على واتساب
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
