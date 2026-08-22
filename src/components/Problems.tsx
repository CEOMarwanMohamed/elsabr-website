import { problems } from '../data/site';
import styles from './Problems.module.css';

export function Problems() {
  return (
    <section id="problems" className="section" style={{ maxWidth: 'var(--page-max)', margin: '0 auto' }}>
      <div className={styles.head}>
        <div className="eyebrow">مشاكل بنحلها</div>
        <h2 className={styles.title}>
          إنت عارف المشاكل دي.
          <br />
          شغلنا إنها متحصلش.
        </h2>
      </div>

      <div className={styles.grid}>
        {problems.map((p) => (
          <div key={p.problem} className={styles.cell}>
            <div className={styles.labelProblem}>المشكلة</div>
            <p className={styles.quote}>{p.problem}</p>
            <div className={styles.rule} />
            <div className={styles.labelAnswer}>عندنا</div>
            <p className={styles.answer}>{p.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
