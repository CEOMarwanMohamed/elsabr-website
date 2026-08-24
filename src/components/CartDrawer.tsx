import { useEffect, useRef, useState } from 'react';
import { useCart } from '../cart/CartContext';
import { MAX_NOTES_LENGTH, whatsappOrderUrl } from '../cart/order';
import { site } from '../data/site';
import { QtyStepper } from './QtyStepper';
import styles from './CartDrawer.module.css';

export function CartDrawer() {
  const { lines, lineCount, unitCount, isOpen, close, setQty, remove, clear } = useCart();
  // Kept in component state rather than localStorage: it is the customer's own
  // details, and the cart is the only thing worth restoring on a refresh.
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
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

  const href = whatsappOrderUrl(lines, { company, location, notes });

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
                    {/* Dropping to zero removes the line, as the ✕ does. */}
                    <QtyStepper
                      value={line.qty}
                      onChange={(n) => setQty(line.code, n)}
                      label={line.name}
                      compact
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* The form scrolls with the items so the pinned footer stays a
              single button — three inputs there squeezed the list on a phone.
              Deliberately short: two fields that actually speed up a quote. We
              do not ask for a phone number — the order arrives from the
              customer's own WhatsApp, so we already have it. */}
          {lineCount > 0 && (
            <div className={styles.fields}>
              <label className={styles.fieldLabel}>
                اسم الشركة (اختياري)
                <input
                  className={styles.field}
                  type="text"
                  maxLength={80}
                  placeholder="الشركة أو الجهة"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </label>

              <label className={styles.fieldLabel}>
                مكان التسليم (اختياري)
                <input
                  className={styles.field}
                  type="text"
                  maxLength={80}
                  placeholder="المنطقة أو عنوان الفرع"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>

              <label className={styles.fieldLabel}>
                ملاحظات على الطلب (اختياري)
                <textarea
                  className={styles.notes}
                  rows={2}
                  maxLength={MAX_NOTES_LENGTH}
                  placeholder="موعد التوريد، أي تفاصيل تانية"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        {lineCount > 0 && (
          <div className={styles.foot}>
            {href ? (
              <a
                className={styles.send}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                ابعت الطلب على واتساب
              </a>
            ) : (
              // Only when the WhatsApp number is missing or malformed: keep a
              // working path instead of a dead link.
              <a className={styles.send} href={site.phoneHref}>
                اتصل بينا عشان نستلم الطلب
              </a>
            )}

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
