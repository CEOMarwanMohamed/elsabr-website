import { stats } from '../data/site';
import styles from './About.module.css';

export function About() {
  return (
    <section id="team" className={`section ${styles.team}`}>
      <div className={`shell ${styles.inner}`}>
        <div>
          <div className={styles.eyebrowDark}>مين إحنا</div>
          <h2 className={styles.title}>
            اسمنا الصبر،
            <br />
            ومش اختيار عشوائي.
          </h2>
          <p className={styles.body}>
            الصبر أهم حاجة في النجاح. مفيش علاقة بتكبر بيوم واحد. عشان كده بنشتغل بعيد
            المدى: نسلّم في الميعاد، ونفضل موجودين بعد الفاتورة.
          </p>
          <p className={styles.body}>
            فريقنا عنده سنين خبرة في التوريد والمخازن والتعامل مع المشتريات. مش شركة
            بتتعلم على حساب عملائها.
          </p>
        </div>

        <div className={styles.stats}>
          {stats.map((s) => (
            <div key={s.title} className={styles.stat}>
              <div className={styles.value}>
                <bdi>{s.value}</bdi>
              </div>
              <div>
                <div className={styles.statTitle}>{s.title}</div>
                <p className={styles.statBody}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
