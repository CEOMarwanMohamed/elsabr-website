import { Link } from 'react-router-dom';
import { categories } from '../data/site';
import styles from './Categories.module.css';

export function Categories() {
  return (
    <section id="products" className="section" style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
      <div className={styles.head}>
        <div>
          <div className="eyebrow">أقسام التوريد</div>
          <h2 className={styles.title}>
            ستة أقسام،
            <br />
            ومورّد واحد.
          </h2>
        </div>
        <div className={styles.aside}>
          <p>بدل ما تتعامل مع خمس جهات، كل ده بيوصلك من مصدر واحد.</p>
          <Link to="/catalog" className={styles.asideLink}>
            شوف الكتالوج ←
          </Link>
        </div>
      </div>

      <div className={styles.grid}>
        {categories.map((cat) => (
          <article key={cat.no} className={styles.card}>
            <div className={styles.no}>{cat.no}</div>
            <div>
              <h3 className={styles.cardTitle}>{cat.title}</h3>
              <p className={styles.blurb}>{cat.blurb}</p>
            </div>
            <div className={styles.foot}>
              <span className={styles.availability}>{cat.availability}</span>
              <a href="#quote">عرض سعر ←</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
