import { useEffect, useMemo, useRef, useState } from 'react';
import { MAX_QTY, type CartLine } from '../cart/CartContext';
import { catalog } from '../data/catalog';
import { QtyStepper } from './QtyStepper';
import styles from './ProductPicker.module.css';

/** One orderable entry in the list: a product, or one size of a product. */
interface Option {
  code: string;
  name: string;
  size: string;
  unit: string;
  image: string | null;
  imageAlt: string | null;
  inStock: boolean;
  availability: string;
  section: string;
}

/**
 * The catalogue flattened once at module load — it is static data.
 *
 * Multi-size products become one entry per variant, keyed by the variant's own
 * code, exactly as the cart keys its lines: picking A4 and A3 of the same
 * product gives two rows rather than one ambiguous one.
 */
const OPTIONS: Option[] = catalog.flatMap((section) =>
  section.products.flatMap((p) => {
    const base = {
      name: p.name,
      unit: p.unit,
      image: p.image,
      imageAlt: p.imageAlt,
      inStock: p.inStock,
      availability: p.availability,
      section: section.title,
    };
    return p.variants?.length
      ? p.variants.map((v) => ({ ...base, code: v.code, size: v.size }))
      : [{ ...base, code: p.code, size: p.size }];
  }),
);

/**
 * Folds the spellings a visitor is likely to type: bare and hamza'd alef, the
 * two forms of ya, ta marbuta. Without this, searching "اجهزة" misses
 * "الأجهزة".
 */
function fold(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[ً-ْ]/g, '')
    .trim();
}

interface Props {
  value: CartLine[];
  onChange: (next: CartLine[]) => void;
  /** Shown under the control when the form was submitted with nothing in it. */
  error?: string;
}

export function ProductPicker({ value, onChange, error }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Close on a click anywhere outside, the way a native select would.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Opening puts the caret in the search box: on a long list, typing is the
  // fastest way in.
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const groups = useMemo(() => {
    const q = fold(query);
    const hits = q
      ? OPTIONS.filter((o) =>
          fold(`${o.name} ${o.size} ${o.unit} ${o.code} ${o.section}`).includes(q),
        )
      : OPTIONS;

    const bySection = new Map<string, Option[]>();
    for (const o of hits) {
      const list = bySection.get(o.section);
      if (list) list.push(o);
      else bySection.set(o.section, [o]);
    }
    return [...bySection.entries()];
  }, [query]);

  const hitCount = groups.reduce((n, [, list]) => n + list.length, 0);
  const qtyOf = (code: string) => value.find((l) => l.code === code)?.qty ?? 0;

  /** Adding something already picked bumps it, as the catalogue cards do. */
  const add = (option: Option) => {
    const hit = value.find((l) => l.code === option.code);
    if (hit) {
      onChange(
        value.map((l) =>
          l.code === option.code ? { ...l, qty: Math.min(MAX_QTY, l.qty + 1) } : l,
        ),
      );
      return;
    }
    onChange([
      ...value,
      {
        code: option.code,
        name: option.name,
        unit: option.unit,
        qty: 1,
        ...(option.size ? { size: option.size } : {}),
      },
    ]);
  };

  const setQty = (code: string, qty: number) => {
    // Stepping below one removes the row, as the ✕ does.
    onChange(
      qty < 1
        ? value.filter((l) => l.code !== code)
        : value.map((l) => (l.code === code ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  };

  const thumb = (option: Pick<Option, 'image' | 'imageAlt' | 'name'>) =>
    option.image ? (
      <img
        className={styles.thumbImg}
        src={option.image}
        alt={option.imageAlt ?? option.name}
        loading="lazy"
        width={56}
        height={56}
      />
    ) : (
      <span className={styles.thumbEmpty} aria-hidden="true">
        الصبر
      </span>
    );

  return (
    <div className={styles.picker} ref={wrapRef}>
      {value.length > 0 && (
        <ul className={styles.chosen}>
          {value.map((line) => {
            const option = OPTIONS.find((o) => o.code === line.code);
            return (
              <li key={line.code} className={styles.row}>
                <span className={styles.thumb}>
                  {thumb(option ?? { image: null, imageAlt: null, name: line.name })}
                </span>

                <span className={styles.rowText}>
                  <span className={styles.rowName}>{line.name}</span>
                  <span className={styles.rowMeta}>
                    <bdi>{line.code}</bdi>
                    {line.size && <span>{line.size}</span>}
                    {line.unit && <span>{line.unit}</span>}
                  </span>
                </span>

                <QtyStepper
                  value={line.qty}
                  onChange={(n) => setQty(line.code, n)}
                  label={line.name}
                  compact
                />

                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => setQty(line.code, 0)}
                  aria-label={`حذف ${line.name}`}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="picker-panel"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? 'picker-error' : undefined}
      >
        <span className={styles.togglePlus} aria-hidden="true">
          +
        </span>
        {value.length ? 'ضيف صنف تاني من الكتالوج' : 'اختر الأصناف من الكتالوج'}
      </button>

      {open && (
        <div id="picker-panel" className={styles.panel}>
          <input
            ref={searchRef}
            type="search"
            className={styles.search}
            placeholder="دوّر على صنف أو قسم…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="بحث في الكتالوج"
          />

          {/* The count is live so a search that narrows to nothing is
              announced, not just silently empty. */}
          <div className={styles.count} role="status">
            {hitCount ? `${hitCount} صنف` : 'مفيش صنف بالاسم ده'}
          </div>

          <div className={styles.list}>
            {groups.map(([section, items]) => (
              <div key={section}>
                <div className={styles.group}>{section}</div>
                {items.map((o) => {
                  const picked = qtyOf(o.code);
                  return (
                    <div key={o.code} className={styles.option}>
                      {/* The photo and the name are one big add target, so a
                          first pick is a single click anywhere on the row. */}
                      <button
                        type="button"
                        className={styles.optionMain}
                        onClick={() => add(o)}
                      >
                        <span className={styles.thumb}>{thumb(o)}</span>

                        <span className={styles.rowText}>
                          <span className={styles.rowName}>{o.name}</span>
                          <span className={styles.rowMeta}>
                            {o.size && <span>{o.size}</span>}
                            {o.unit && <span>{o.unit}</span>}
                            <span className={o.inStock ? styles.in : styles.onOrder}>
                              {o.availability}
                            </span>
                          </span>
                        </span>
                      </button>

                      {/* Once it is in, the button becomes the quantity control
                          in place, so the whole choice is made without leaving
                          the list. Stepping to zero takes it back out. */}
                      {picked ? (
                        <QtyStepper
                          value={picked}
                          onChange={(n) => setQty(o.code, n)}
                          label={o.name}
                          compact
                        />
                      ) : (
                        <button
                          type="button"
                          className={styles.pick}
                          onClick={() => add(o)}
                        >
                          أضف
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <span id="picker-error" className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
