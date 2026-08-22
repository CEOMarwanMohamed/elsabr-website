import { site } from '../data/site';
import type { CartLine } from './CartContext';

/**
 * Builds the WhatsApp order message, matching the design's format.
 * Prices are deliberately left out — the cart requests a written quote,
 * it does not price the order.
 */
export function buildOrderMessage(lines: CartLine[], notes: string): string {
  const units = lines.reduce((n, l) => n + l.qty, 0);
  const out: string[] = ['طلب من كتالوج الصبر', ''];

  lines.forEach((l, i) => {
    const parts = [`${i + 1}. ${l.name} — الكمية: ${l.qty}`];
    if (l.unit) parts.push(` × ${l.unit}`);
    if (l.code) parts.push(` — كود ${l.code}`);
    out.push(parts.join(''));
  });

  out.push('', `إجمالي: ${lines.length} صنف / ${units} وحدة`);

  const trimmed = notes.trim();
  if (trimmed) out.push('', `ملاحظات: ${trimmed}`);

  out.push('', 'محتاج عرض سعر مكتوب لو سمحتم.');
  return out.join('\n');
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
