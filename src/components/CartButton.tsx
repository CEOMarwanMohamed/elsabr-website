import { useEffect, useState } from 'react';
import { useCart } from '../cart/CartContext';
import styles from './CartButton.module.css';

/** Re-triggers the bump animation each time something is added. */
function useBump(tick: number) {
  const [bumping, setBumping] = useState(false);
  useEffect(() => {
    if (tick === 0) return;
    setBumping(true);
    const t = window.setTimeout(() => setBumping(false), 220);
    return () => window.clearTimeout(t);
  }, [tick]);
  return bumping;
}

export function CartButton() {
  const { unitCount, addTick, open } = useCart();
  const bumping = useBump(addTick);

  return (
    <button type="button" className={styles.button} onClick={open}>
      السلة
      <span
        className={`${styles.badge} ${unitCount ? styles.badgeFull : ''} ${
          bumping ? styles.bump : ''
        }`}
      >
        {unitCount}
      </span>
    </button>
  );
}

export function CartFab() {
  const { lineCount, unitCount, addTick, open, isOpen } = useCart();
  const bumping = useBump(addTick);

  if (lineCount === 0 || isOpen) return null;

  return (
    <button type="button" className={styles.fab} onClick={open}>
      <span>مراجعة السلة</span>
      <span className={`${styles.fabCount} ${bumping ? styles.bump : ''}`}>
        {unitCount}
      </span>
    </button>
  );
}
