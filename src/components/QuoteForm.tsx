import { useState, type FormEvent } from 'react';
import { site } from '../data/site';
import styles from './QuoteForm.module.css';

interface QuoteFields {
  name: string;
  company: string;
  phone: string;
  quantity: string;
  product: string;
}

const EMPTY: QuoteFields = {
  name: '',
  company: '',
  phone: '',
  quantity: '',
  product: '',
};

const FIELD_LABELS: Record<keyof QuoteFields, string> = {
  name: 'الاسم',
  company: 'الشركة / الجهة',
  phone: 'رقم الموبايل',
  quantity: 'الكمية التقريبية',
  product: 'المنتج المطلوب',
};

// Egyptian mobile: 01 followed by 0/1/2/5 and 8 more digits, spaces allowed.
const PHONE_RE = /^01[0125]\d{8}$/;

function validate(values: QuoteFields) {
  const errors: Partial<Record<keyof QuoteFields, string>> = {};
  if (!values.name.trim()) errors.name = 'اكتب اسمك';
  if (!values.phone.trim()) errors.phone = 'اكتب رقم الموبايل';
  else if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, '')))
    errors.phone = 'رقم الموبايل مش مظبوط';
  if (!values.product.trim()) errors.product = 'اكتب المنتج المطلوب';
  return errors;
}

/**
 * The design has no backend behind this form. Until a submission endpoint
 * exists (a Cloudflare Pages Function or a form service), the request is handed
 * to the visitor's mail client so nothing is silently dropped.
 */
function sendQuote(values: QuoteFields) {
  const body = (Object.keys(FIELD_LABELS) as (keyof QuoteFields)[])
    .map((key) => `${FIELD_LABELS[key]}: ${values[key] || '—'}`)
    .join('\n');
  const subject = `طلب عرض سعر — ${values.company.trim() || values.name.trim()}`;
  window.location.href =
    `mailto:${site.email}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
}

export function QuoteForm() {
  const [values, setValues] = useState<QuoteFields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFields, string>>>({});

  const set = (key: keyof QuoteFields) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) sendQuote(values);
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
          <div className={styles.row}>
            {field('phone', '01x xxxx xxxx', 'tel')}
            {field('quantity', 'مثلاً 20 وحدة شهريًا')}
          </div>
          <div className={styles.fieldWide}>{field('product', 'مثلاً ورق A4 80 جرام')}</div>

          <button type="submit" className={styles.submit}>
            ابعت الطلب
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
