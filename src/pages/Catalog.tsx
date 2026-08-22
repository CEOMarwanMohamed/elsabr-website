import { Link } from 'react-router-dom';

/**
 * Placeholder. The catalog design (الكتالوج.dc.html) still needs to be
 * imported from the Claude Design project before this page has real content.
 */
export default function Catalog() {
  return (
    <section className="section shell" style={{ minHeight: '52vh' }}>
      <div className="eyebrow">الكتالوج</div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: 'clamp(30px, 5vw, 44px)',
          letterSpacing: '-1.1px',
          lineHeight: 1.3,
          margin: '0 0 20px',
        }}
      >
        الكتالوج قيد الإعداد.
      </h1>
      <p style={{ fontSize: 17, color: 'var(--text-body)', lineHeight: 1.8, maxWidth: 560 }}>
        لحد ما يخلص، تقدر تشوف أقسام التوريد على الصفحة الرئيسية أو تطلب عرض سعر
        وهنرد عليك في نفس اليوم.
      </p>
      <p style={{ marginTop: 28, fontSize: 16, fontWeight: 500 }}>
        <Link to="/">← رجوع للصفحة الرئيسية</Link>
      </p>
    </section>
  );
}
