import { useEffect, useRef, useState } from 'react';
import { useCart } from '../cart/CartContext';
import { buildOrderMessage, whatsappUrl } from '../cart/order';
import { site } from '../data/site';
import styles from './CartDrawer.module.css';

export function CartDrawer() {
  const { lines, lineCount, unitCount, isOpen, close, setQty, remove, clear } = useCart();
  const [notes, setNotes] = useState('');
  const panelRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Escape closes; focus moves into the panel so the drawer is keyboard-usable.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  // Stop the page behind the drawer from scrolling while it is open.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const href = lineCount ? whatsappUrl(buildOrderMessage(lines, notes)) : undefined;

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        dir="rtl"
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="سلة الطلب"
        aria-hidden={!isOpen}
        // Keep the closed panel out of the tab order. React 19 renders `inert`
        // from a real boolean — a cast string is dropped silently.
        inert={!isOpen}
      >
        <div className={styles.head}>
          <div>
            <h2 className={styles.title}>سلة الطلب</h2>
            <div className={styles.summary}>
              {lineCount
                ? `${lineCount} صنف — إجمالي ${unitCount} وحدة`
                : 'السلة فاضية'}
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={close}
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {lineCount === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>لسه فاضية</div>
              <p className={styles.emptyBody}>
                اظبط الكمية جانب أي صنف واضغط «أضف للسلة». الطلب بيتحول لرسالة واتساب
                جاهزة، والأسعار بترجعلك مكتوبة.
              </p>
            </div>
          ) : (
            <div className={styles.items}>
              {lines.map((line) => (
                <div key={line.code} className={styles.row}>
                  <div className={styles.rowTop}>
                    <div className={styles.rowName}>{line.name}</div>
                    <button
                      type="button"
                      className={styles.rowRemove}
                      onClick={() => remove(line.code)}
                      aria-label={`حذف ${line.name}`}
                    >
                      ✕
                    </button>
                  </div>

                  <div className={styles.rowMeta}>
                    {line.code && <bdi>{line.code}</bdi>}
                    {line.unit && <span>{line.unit}</span>}
                  </div>

                  <div className={styles.rowQty}>
                    <span className={styles.rowQtyLabel}>الكمية</span>
                    <div className={styles.stepper}>
                      <button
                        type="button"
                        className={styles.step}
                        onClick={() => setQty(line.code, line.qty - 1)}
                        aria-label="أقل"
                      >
                        −
                      </button>
                      <span className={styles.stepValue}>{line.qty}</span>
                      <button
                        type="button"
                        className={styles.step}
                        onClick={() => setQty(line.code, line.qty + 1)}
                        aria-label="أكثر"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {lineCount > 0 && (
          <div className={styles.foot}>
            <label className={styles.notesLabel}>
              ملاحظات على الطلب (اختياري)
              <textarea
                className={styles.notes}
                rows={2}
                placeholder="موعد التوريد، عنوان الفرع، أي تفاصيل"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

            <a
              className={styles.send}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              ابعت الطلب على واتساب
            </a>

            <div className={styles.footRow}>
              <a href={site.phoneHref} className={styles.footCall}>
                أو اتصل بينا: <bdi>{site.phoneDisplay}</bdi>
              </a>
              <button type="button" className={styles.clear} onClick={clear}>
                فضّي السلة
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
