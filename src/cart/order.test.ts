import { describe, expect, it } from 'vitest';
import type { Product } from '../data/catalog';
import { site } from '../data/site';
import type { CartLine } from './CartContext';
import {
  MAX_NOTES_LENGTH,
  buildOrderMessage,
  isWhatsappConfigured,
  whatsappChatUrl,
  whatsappOrderUrl,
  whatsappProductUrl,
} from './order';

const line = (over: Partial<CartLine> = {}): CartLine => ({
  code: 'SBR-CP-A480',
  name: 'Multi-Office A4 — 80 جرام',
  unit: 'كرتونة — 5 رزم × 500 ورقة',
  qty: 5,
  ...over,
});

/** Builds n distinct lines, so the length ladder has real data to chew on. */
const lines = (n: number): CartLine[] =>
  Array.from({ length: n }, (_, i) =>
    line({ code: `SBR-XX-${i.toString().padStart(3, '0')}`, qty: 20 }),
  );

const product: Product = {
  code: 'SBR-PR-BAN',
  name: 'بانر مطبوع',
  size: '100 × 200 سم',
  unit: 'بالمتر',
  price: 240,
  inStock: false,
  availability: 'تحت الطلب',
  image: null,
  imageAlt: null,
};

describe('buildOrderMessage', () => {
  it('lists a single product with quantity, unit and code', () => {
    const msg = buildOrderMessage([line()]);
    expect(msg).toContain('1. Multi-Office A4 — 80 جرام');
    expect(msg).toContain('الكمية: 5');
    expect(msg).toContain('كود SBR-CP-A480');
  });

  it('numbers multiple products and totals lines and units', () => {
    const msg = buildOrderMessage([line(), line({ code: 'B', qty: 3 })]);
    expect(msg).toContain('1. ');
    expect(msg).toContain('2. ');
    expect(msg).toContain('إجمالي: 2 صنف / 8 وحدة');
  });

  it('never mentions price — the cart requests a quote', () => {
    const msg = buildOrderMessage([line()], { notes: 'حاجة' });
    expect(msg).not.toMatch(/جنيه|price|السعر|\d+\.\d\d/);
  });

  it('omits customer fields that were not filled in', () => {
    const msg = buildOrderMessage([line()], { company: '  ' });
    expect(msg).not.toContain('الشركة:');
    expect(msg).not.toContain('مكان التسليم:');
    expect(msg).not.toContain('ملاحظات:');
  });

  it('includes only the customer fields that were provided', () => {
    const msg = buildOrderMessage([line()], {
      company: 'شركة النور',
      notes: 'التسليم الصبح',
    });
    expect(msg).toContain('الشركة: شركة النور');
    expect(msg).not.toContain('مكان التسليم:');
    expect(msg).toContain('ملاحظات: التسليم الصبح');
  });

  it('trims an over-long note instead of dropping it', () => {
    const msg = buildOrderMessage([line()], { notes: 'م'.repeat(900) });
    const note = msg.split('ملاحظات: ')[1].split('\n')[0];
    expect(note.length).toBeLessThanOrEqual(MAX_NOTES_LENGTH + 1);
    expect(note.endsWith('…')).toBe(true);
  });

  it('survives names with punctuation and large quantities', () => {
    const msg = buildOrderMessage([
      line({ name: 'ورق A4 (80 جم) — "ممتاز" 100%، #1', qty: 999 }),
    ]);
    expect(msg).toContain('ورق A4 (80 جم) — "ممتاز" 100%، #1');
    expect(msg).toContain('999');
  });

  it('falls back to the name when a line has no code', () => {
    expect(buildOrderMessage([line({ code: '' })], {}, 'code')).toContain(
      'Multi-Office A4',
    );
  });

  it('drops the unit but keeps the code as detail decreases', () => {
    const short = buildOrderMessage([line()], {}, 'short');
    expect(short).toContain('SBR-CP-A480');
    expect(short).not.toContain('كرتونة');

    const code = buildOrderMessage([line()], {}, 'code');
    expect(code).toContain('SBR-CP-A480');
    expect(code).toContain('5');
  });
});

describe('whatsappOrderUrl', () => {
  it('returns null for an empty cart', () => {
    expect(whatsappOrderUrl([])).toBeNull();
  });

  it('points at the configured number and encodes the message', () => {
    const url = whatsappOrderUrl([line()]);
    expect(url).not.toBeNull();
    expect(url!.startsWith(`https://wa.me/${site.whatsapp}?text=`)).toBe(true);
    // Raw spaces and newlines would break the URL.
    expect(url).not.toMatch(/[ \n]/);
  });

  it('round-trips Arabic, line breaks and punctuation intact', () => {
    const notes = 'التسليم الصبح — قبل 10 ص، #عاجل 100%';
    const url = whatsappOrderUrl([line()], { notes })!;
    const decoded = decodeURIComponent(url.split('?text=')[1]);
    expect(decoded).toContain(notes);
    expect(decoded).toContain('Multi-Office A4 — 80 جرام');
    expect(decoded.split('\n').length).toBeGreaterThan(3);
  });

  it('keeps every cart size under the length ceiling', () => {
    for (const n of [1, 5, 10, 20, 36, 80]) {
      const url = whatsappOrderUrl(lines(n), { notes: 'م'.repeat(400) })!;
      expect(url, `cart of ${n}`).not.toBeNull();
      expect(url.length, `cart of ${n}`).toBeLessThanOrEqual(2000);
    }
  });

  it('keeps full detail for a small cart', () => {
    const decoded = decodeURIComponent(
      whatsappOrderUrl([line()])!.split('?text=')[1],
    );
    expect(decoded).toContain('كرتونة');
  });

  it('condenses rather than truncating a large cart', () => {
    const decoded = decodeURIComponent(
      whatsappOrderUrl(lines(36))!.split('?text=')[1],
    );
    // Every line still present, and the closing line survived.
    expect(decoded).toContain('SBR-XX-035');
    expect(decoded).toContain('محتاج عرض سعر مكتوب');
  });

  it('flags the remainder when even code-only cannot fit', () => {
    const decoded = decodeURIComponent(
      whatsappOrderUrl(lines(400))!.split('?text=')[1],
    );
    expect(decoded).toMatch(/و\d+ صنف تاني/);
  });
});

describe('whatsappProductUrl', () => {
  it('builds a single-product enquiry carrying the quantity', () => {
    const decoded = decodeURIComponent(
      whatsappProductUrl(product, 7)!.split('?text=')[1],
    );
    expect(decoded).toContain('بانر مطبوع');
    expect(decoded).toContain('الكود: SBR-PR-BAN');
    expect(decoded).toContain('الكمية المطلوبة: 7');
  });

  it('defaults to a quantity of one', () => {
    const decoded = decodeURIComponent(
      whatsappProductUrl(product)!.split('?text=')[1],
    );
    expect(decoded).toContain('الكمية المطلوبة: 1');
  });
});

describe('configuration', () => {
  it('accepts the configured number and builds a bare chat URL', () => {
    expect(isWhatsappConfigured()).toBe(true);
    expect(whatsappChatUrl()).toBe(`https://wa.me/${site.whatsapp}`);
  });

  it('is stored as digits only — no +, spaces or separators', () => {
    expect(site.whatsapp).toMatch(/^[1-9][0-9]{7,14}$/);
  });
});
