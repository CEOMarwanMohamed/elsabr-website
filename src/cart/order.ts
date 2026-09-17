import type { Product, ProductVariant } from '../data/catalog';
import { site } from '../data/site';
import type { CartLine } from './CartContext';

/**
 * Conservative ceiling for the whole click-to-chat URL.
 *
 * WhatsApp publishes no limit, but Arabic costs ~4x once percent-encoded (two
 * UTF-8 bytes become six URL characters), so a full 36-line cart reaches about
 * 10,000 characters — well into the range where browsers and the WhatsApp
 * handler start truncating. Lines drop to shorter forms until the URL fits.
 * Every form keeps the product code, so a condensed order is never ambiguous:
 * the supplier can resolve name and unit from the code. Raise this if real
 * sending proves more forgiving; it is a one-line change.
 */
const MAX_URL_LENGTH = 2000;

/** Longest note carried in the URL. Beyond this the tail is trimmed. */
export const MAX_NOTES_LENGTH = 400;

/** Optional details the customer can add before ordering. */
export interface OrderCustomer {
  /** Asked for by the quote form; the cart drawer leaves it out. */
  name?: string;
  company?: string;
  /** A callback number. The cart does not ask — the order already arrives
      from the customer's own WhatsApp — but the quote form does. */
  phone?: string;
  location?: string;
  notes?: string;
}

/** Opening line of a cart order. The quote form passes its own. */
export const CART_HEADING = 'طلب من كتالوج الصبر';

/** How much detail each order line carries. See MAX_URL_LENGTH. */
export type OrderDetail = 'full' | 'short' | 'code';

/**
 * True when site.whatsapp is a usable click-to-chat number: international
 * format, digits only, no '+', spaces, or separators.
 */
export function isWhatsappConfigured(): boolean {
  return /^[1-9][0-9]{7,14}$/.test(site.whatsapp);
}

/** The one place a wa.me URL is built. Null when the number is unusable. */
function chatUrl(message?: string): string | null {
  if (!isWhatsappConfigured()) return null;
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

function clampNotes(notes: string | undefined): string {
  const trimmed = (notes ?? '').trim();
  if (trimmed.length <= MAX_NOTES_LENGTH) return trimmed;
  return `${trimmed.slice(0, MAX_NOTES_LENGTH).trimEnd()}…`;
}

function formatLine(line: CartLine, index: number, detail: OrderDetail): string {
  const no = `${index + 1}. `;

  if (detail === 'code') {
    return `${no}${line.code || line.name} × ${line.qty}`;
  }

  if (detail === 'short') {
    const name = line.size ? `${line.name} (${line.size})` : line.name;
    const parts = [`${no}${name} — ${line.qty}`];
    if (line.code) parts.push(` — ${line.code}`);
    return parts.join('');
  }

  const parts = [`${no}${line.name} — الكمية: ${line.qty}`];
  if (line.size) parts.push(` — مقاس ${line.size}`);
  if (line.unit) parts.push(` × ${line.unit}`);
  if (line.code) parts.push(` — كود ${line.code}`);
  return parts.join('');
}

/**
 * Builds the WhatsApp order message.
 * Prices are deliberately left out — the cart requests a written quote,
 * it does not price the order.
 */
export function buildOrderMessage(
  lines: CartLine[],
  customer: OrderCustomer = {},
  detail: OrderDetail = 'full',
  heading: string = CART_HEADING,
): string {
  const units = lines.reduce((n, l) => n + l.qty, 0);
  const out: string[] = [heading];

  // Only the fields the customer actually filled in.
  const identity: string[] = [];
  const add = (label: string, value?: string) => {
    const v = value?.trim();
    if (v) identity.push(`${label}: ${v}`);
  };
  add('الاسم', customer.name);
  add('الشركة', customer.company);
  add('رقم الموبايل', customer.phone);
  add('مكان التسليم', customer.location);
  if (identity.length) out.push('', ...identity);

  // A quote can be notes only — someone asking for something the catalogue
  // does not list yet. Skipping the list and the total keeps that message from
  // reading as an order for nothing.
  if (lines.length) {
    out.push('');
    lines.forEach((line, i) => out.push(formatLine(line, i, detail)));
    out.push('', `إجمالي: ${lines.length} صنف / ${units} وحدة`);
  }

  const notes = clampNotes(customer.notes);
  if (notes) out.push('', `ملاحظات: ${notes}`);

  out.push('', 'محتاج عرض سعر مكتوب لو سمحتم.');
  return out.join('\n');
}

/**
 * Order URL, shortening the lines until the result fits MAX_URL_LENGTH.
 * Null when the number is not configured, or when there is nothing to say —
 * no lines and no note.
 */
export function whatsappOrderUrl(
  lines: CartLine[],
  customer: OrderCustomer = {},
  heading: string = CART_HEADING,
): string | null {
  if (!isWhatsappConfigured()) return null;
  // The quote form can send a note with no lines: someone asking for an item
  // the catalogue does not carry yet. An empty everything is still nothing.
  if (lines.length === 0 && !clampNotes(customer.notes)) return null;

  const fits = (url: string | null): url is string =>
    url !== null && url.length <= MAX_URL_LENGTH;

  // 1–3: shorten the lines, keeping the note whole.
  const details: OrderDetail[] = ['full', 'short', 'code'];
  for (const detail of details) {
    const url = chatUrl(buildOrderMessage(lines, customer, detail, heading));
    if (fits(url)) return url;
  }

  // 4: the note is the overflow — a long Arabic note costs ~6 URL characters
  // per letter and can overflow even a one-line cart. Trim it to the largest
  // prefix that fits before touching any product line: the note is
  // supplementary, the lines are the order.
  const note = clampNotes(customer.notes);
  if (note) {
    const urlFor = (n: string) =>
      chatUrl(buildOrderMessage(lines, { ...customer, notes: n }, 'code', heading));

    let lo = 0;
    let hi = note.length;
    let best: string | null = null;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const candidate = mid === 0 ? '' : `${note.slice(0, mid).trimEnd()}…`;
      const url = urlFor(candidate);
      if (fits(url)) {
        best = url;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (best) return best;
  }

  // 5: even code-only with no note overflows (a catalogue far larger than
  // today's). Send what fits and say the rest is coming, rather than a list
  // the browser silently cuts off.
  const bare: OrderCustomer = { ...customer, notes: '' };
  for (let keep = lines.length - 1; keep >= 1; keep--) {
    const rest = lines.length - keep;
    const message = `${buildOrderMessage(lines.slice(0, keep), bare, 'code', heading)}
(و${rest} صنف تاني — هبعتهم في رسالة بعد دي.)`;
    const url = chatUrl(message);
    if (fits(url)) return url;
  }

  return chatUrl(buildOrderMessage(lines.slice(0, 1), bare, 'code', heading));
}

/** Single-product enquiry. Same mechanism as the cart, one item. */
export function whatsappProductUrl(
  product: Product,
  qty = 1,
  variant?: ProductVariant,
): string | null {
  const size = variant?.size ?? product.size;
  const message = [
    'السلام عليكم، حابب أسأل عن الصنف ده:',
    '',
    product.name,
    `الكود: ${variant?.code ?? product.code}`,
    size ? `المقاس: ${size}` : '',
    product.unit ? `الوحدة: ${product.unit}` : '',
    `الكمية المطلوبة: ${qty}`,
    '',
    'متوفر إمتى وبكام؟',
  ]
    .filter(Boolean)
    .join('\n');

  return chatUrl(message);
}

/** Plain chat, no prefilled message. */
export function whatsappChatUrl(): string | null {
  return chatUrl();
}
