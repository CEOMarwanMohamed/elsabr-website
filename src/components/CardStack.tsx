import { useCallback, useEffect, useRef } from 'react';
import { categories } from '../data/site';
import styles from './CardStack.module.css';

const FLING_MS = 380;
const DRAG_THRESHOLD = 80;

/**
 * Draggable stack of category sheets, ported from the design canvas script.
 * The transforms are driven imperatively (not through state) so a drag stays
 * at pointer framerate instead of re-rendering the whole stack per move.
 */
export function CardStack() {
  const stackRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);

  const sheetsRef = useRef<HTMLElement[]>([]);
  const orderRef = useRef<number[]>([]);
  const busyRef = useRef(false);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const dxRef = useRef(0);
  const timerRef = useRef<number | undefined>(undefined);

  const place = useCallback((el: HTMLElement, depth: number, instant: boolean) => {
    el.style.transition = instant
      ? 'none'
      : 'transform .5s cubic-bezier(.22,.72,.16,1), opacity .35s ease';
    el.style.zIndex = String(100 - depth);
    el.style.opacity = depth < 4 ? '1' : '0';
    el.style.pointerEvents = depth === 0 ? 'auto' : 'none';
    el.style.cursor = depth === 0 ? 'grab' : 'default';
    el.style.transform =
      `translate(${depth * -11}px, ${depth * 13}px) ` +
      `rotate(${depth * 1.5}deg) scale(${1 - depth * 0.018})`;
    // Only the front sheet shows its contents; the ones behind read as paper edges.
    Array.from(el.children).forEach((child) => {
      const c = child as HTMLElement;
      c.style.transition = 'opacity .25s ease';
      c.style.opacity = depth === 0 ? '1' : '0';
    });
    el.setAttribute('aria-hidden', depth === 0 ? 'false' : 'true');
  }, []);

  const updateDots = useCallback((topIdx: number) => {
    const dots = dotsRef.current;
    if (!dots) return;
    Array.from(dots.children).forEach((child, i) => {
      const d = child as HTMLElement;
      const on = i === topIdx;
      d.style.background = on ? 'var(--green)' : 'var(--border-input)';
      d.style.transform = on ? 'scaleX(2.2)' : 'none';
    });
  }, []);

  const layout = useCallback(
    (instant: boolean, instantIdx?: number) => {
      orderRef.current.forEach((si, depth) => {
        place(sheetsRef.current[si], depth, instant || si === instantIdx);
      });
      updateDots(orderRef.current[0]);
    },
    [place, updateDots],
  );

  const fling = useCallback(
    (dir: 1 | -1) => {
      if (busyRef.current || sheetsRef.current.length === 0) return;
      busyRef.current = true;

      const top = sheetsRef.current[orderRef.current[0]];
      top.style.transition = 'transform .4s cubic-bezier(.3,.05,.4,1), opacity .4s ease';
      top.style.transform = `translate(${dir * 640}px, 80px) rotate(${dir * 16}deg)`;
      top.style.opacity = '0';

      const incoming = sheetsRef.current[orderRef.current[1]];
      place(incoming, 0, false);
      updateDots(orderRef.current[1]);

      timerRef.current = window.setTimeout(() => {
        const si = orderRef.current.shift();
        if (si !== undefined) orderRef.current.push(si);
        layout(false, si);
        busyRef.current = false;
      }, FLING_MS);
    },
    [layout, place, updateDots],
  );

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    sheetsRef.current = Array.from(
      stack.querySelectorAll<HTMLElement>('[data-sheet]'),
    );
    orderRef.current = sheetsRef.current.map((_, i) => i);
    layout(true);

    const onDown = (e: PointerEvent) => {
      if (busyRef.current) return;
      const top = sheetsRef.current[orderRef.current[0]];
      const target = e.target as HTMLElement | null;
      if (!top || !target || !top.contains(target)) return;
      // Let links inside the sheet behave like links.
      if (target.closest('a')) return;
      draggingRef.current = true;
      startXRef.current = e.clientX;
      dxRef.current = 0;
      top.style.transition = 'none';
      top.style.cursor = 'grabbing';
    };

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      dxRef.current = e.clientX - startXRef.current;
      const dx = dxRef.current;
      const top = sheetsRef.current[orderRef.current[0]];
      top.style.transform =
        `translate(${dx}px, ${Math.abs(dx) * 0.05}px) rotate(${dx * 0.035}deg)`;
    };

    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      const dx = dxRef.current;
      if (Math.abs(dx) > DRAG_THRESHOLD) fling(dx > 0 ? 1 : -1);
      else layout(false);
    };

    stack.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      stack.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.clearTimeout(timerRef.current);
    };
  }, [fling, layout]);

  const total = categories.length;

  return (
    <div className={styles.wrap}>
      <div ref={stackRef} className={styles.stack}>
        {categories.map((cat) => (
          <article key={cat.no} data-sheet className={styles.sheet}>
            <div className={styles.sheetHead}>
              <div>
                <div className={styles.counter}>
                  قسم <bdi>{cat.no}</bdi> من <bdi>{String(total).padStart(2, '0')}</bdi>
                </div>
                <h3 className={styles.sheetTitle}>{cat.title}</h3>
              </div>
              <div
                className={`${styles.badge} ${
                  cat.availability === 'متوفر' ? styles.badgeIn : styles.badgeOrder
                }`}
              >
                {cat.availability}
              </div>
            </div>

            <div className={styles.lines}>
              {cat.lines.map((line) => (
                <div key={line.item} className={styles.line}>
                  <span className={styles.lineItem}>{line.item}</span>
                  <span className={styles.lineUnit}>{line.unit}</span>
                </div>
              ))}
            </div>

            <div className={styles.sheetFoot}>
              <span className={styles.hint}>اسحب تشوف اللي بعده</span>
              <a href="#quote" className={styles.footLink}>
                عرض سعر ←
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.controls}>
        <div ref={dotsRef} className={styles.dots} aria-hidden="true">
          {categories.map((cat) => (
            <span key={cat.no} className={styles.dot} />
          ))}
        </div>
        <button type="button" className={styles.next} onClick={() => fling(-1)}>
          اللي بعده ←
        </button>
      </div>
    </div>
  );
}
