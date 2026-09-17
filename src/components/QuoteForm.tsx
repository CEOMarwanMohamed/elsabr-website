import { useState, type FormEvent } from 'react';
import type { CartLine } from '../cart/CartContext';
import {
  MAX_NOTES_LENGTH,
  buildOrderMessage,
  isWhatsappConfigured,
  whatsappOrderUrl,
} from '../cart/order';
import { site } from '../data/site';
import { ProductPicker } from './ProductPicker';
import styles from './QuoteForm.module.css';

interface QuoteFields {
  name: string;
  company: string;
  phone: string;
  notes: string;
}

const EMPTY: QuoteFields = {
  name: '',
  company: '',
  phone: '',
  notes: '',
};

const FIELD_LABELS: Record<keyof QuoteFields, string> = {
  name: 'الاسم',
  company: 'الشركة / الجهة',
  phone: 'رقم الموبايل',
  notes: 'ملاحظات أو اطلب حاجة مش موجودة عندنا دلوقتي',
};

/** Opening line of the message this form sends. */
const HEADING = 'طلب عرض سعر من موقع الصبر';

// Egyptian mobile: 01 followed by 0/1/2/5 and 8 more digits, spaces allowed.
const PHONE_RE = /^01[0125]\d{8}$/;

type Errors = Partial<Record<keyof QuoteFields | 'products', string>>;

function validate(values: QuoteFields, lines: CartLine[]) {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'اكتب اسمك';
  if (!values.phone.trim()) errors.phone = 'اكتب رقم الموبايل';
  else if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, '')))
    errors.phone = 'رقم الموبايل مش مظبوط';
  // Either half carries the request on its own: a pick from the catalogue, or
  // a note asking for something it does not list yet.
  if (lines.length === 0 && !values.notes.trim())
    errors.products = 'اختر صنف من الكتالوج، أو اكتب اللي محتاجه تحت';
  return errors;
}

/**
 * Fallback for when site.whatsapp is missing or malformed. The request is
 * handed to the visitor's mail client so nothing is silently dropped.
 */
function mailQuote(values: QuoteFields, lines: CartLine[]) {
  const subject = `طلب عرض سعر — ${values.company.trim() || values.name.trim()}`;
  const body = buildOrderMessage(lines, { ...values }, 'full', HEADING);
  window.location.href =
    `mailto:${site.email}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
}

export function QuoteForm() {
  const [values, setValues] = useState<QuoteFields>(EMPTY);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  const set = (key: keyof QuoteFields) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values, lines);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const href = whatsappOrderUrl(lines, { ...values }, HEADING);
    if (!href) {
      mailQuote(values, lines);
      return;
    }
    // Opened from the submit handler itself, so it counts as a user gesture
    // and is not treated as a popup. A blocked window still falls through to
    // navigating this tab rather than doing nothing.
    const opened = window.open(href, '_blank', 'noopener,noreferrer');
    if (!opened) window.location.href = href;
  };

  const field = (
    key: keyof QuoteFields,
    placeholder: string,
    type: 'text' | 'tel' = 'text',
  ) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={`quote-${key}`}>
        {FIELD_LABELS[key]}
      </label>
      <input
        id={`quote-${key}`}
        name={key}
        type={type}
        className={styles.input}
        placeholder={placeholder}
        value={values[key]}
        onChange={set(key)}
        aria-invalid={errors[key] ? 'true' : undefined}
        aria-describedby={errors[key] ? `quote-${key}-error` : undefined}
      />
      {errors[key] && (
        <span id={`quote-${key}-error`} className={styles.error} role="alert">
          {errors[key]}
        </span>
      )}
    </div>
  );

  return (
    <section id="quote" className={styles.quote}>
      <div className={styles.inner}>
        <div>
          <h2 className={styles.title}>
            قولنا محتاج إيه وبكام،
            <br />
            ونرد عليك النهارده.
          </h2>
          <p className={styles.lede}>
            عرض مكتوب وواضح: السعر والكمية والتسليم. من غير أي التزام.
          </p>
        </div>

        <form className={styles.card} onSubmit={onSubmit} noValidate>
          <div className={styles.row}>
            {field('name', 'اسمك بالكامل')}
            {field('company', 'اسم الشركة')}
          </div>
          <div className={styles.rowSingle}>{field('phone', '01x xxxx xxxx', 'tel')}</div>

          <div className={styles.fieldWide}>
            <span className={styles.label}>المنتجات المطلوبة</span>
            <ProductPicker value={lines} onChange={setLines} error={errors.products} />
          </div>

          <div className={styles.fieldWide}>
            <label className={styles.label} htmlFor="quote-notes">
              {FIELD_LABELS.notes}
            </label>
            <textarea
              id="quote-notes"
              name="notes"
              rows={3}
              maxLength={MAX_NOTES_LENGTH}
              className={`${styles.input} ${styles.notes}`}
              placeholder="اكتب أي تفاصيل، أو الصنف اللي محتاجه ومش لاقيه فوق"
              value={values.notes}
              onChange={set('notes')}
            />
          </div>

          <button type="submit" className={styles.submit}>
            {isWhatsappConfigured() ? 'ابعت الطلب على واتساب' : 'ابعت الطلب'}
          </button>

          <p className={styles.note}>
            أو كلمنا على{' '}
            <a href={site.phoneHref}>
              <bdi>{site.phoneDisplay}</bdi>
            </a>{' '}
            من <bdi>{site.hours.from}</bdi> لـ <bdi>{site.hours.to}</bdi>
          </p>
        </form>
      </div>
    </section>
  );
}
