import { useEffect, useRef, useState } from 'react';
import { useCart } from '../cart/CartContext';
import type { Product } from '../data/catalog';
import styles from './ProductCard.module.css';

const MAX_QTY = 999;

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  // The design's demo photos may not be present; fall back rather than
  // showing a broken image. Restoring the files makes photos appear again.
  const [imageOk, setImageOk] = useState(true);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const bump = (d: number) => setQty((q) => Math.max(1, Math.min(MAX_QTY, q + d)));

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
            height={168}
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
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.step}
              onClick={() => bump(-1)}
              aria-label={`أقل — ${product.name}`}
            >
              −
            </button>
            <span className={styles.stepValue}>{qty}</span>
            <button
              type="button"
              className={styles.step}
              onClick={() => bump(1)}
              aria-label={`أكثر — ${product.name}`}
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.addWrap}>
          <button
            type="button"
            className={`${styles.add} ${justAdded ? styles.added : ''}`}
            onClick={onAdd}
          >
            {justAdded ? 'تمّت الإضافة ✓' : 'أضف للسلة'}
          </button>
        </div>
      </div>
    </article>
  );
}
