import { commitments } from '../data/site';
import styles from './Commitments.module.css';

export function Commitments() {
  return (
    <section id="why" className={`section ${styles.why}`}>
      <div className="shell">
        <div className={styles.head}>
          <h2 className={styles.title}>
            خمس حاجات بنلتزم بيها،
            <br />
            وتقدر تحاسبنا عليها.
          </h2>
          <p className={styles.sub}>مش شعارات. دي المعايير اللي بنقيس بيها شغلنا.</p>
        </div>

        <div className={styles.grid}>
          {commitments.map((c) => (
            <div key={c.no} className={styles.cell}>
              <div className={styles.no}>{c.no}</div>
              <h3 className={styles.cellTitle}>{c.title}</h3>
              <p className={styles.cellBody}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
