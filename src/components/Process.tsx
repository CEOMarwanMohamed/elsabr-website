import { processSteps } from '../data/site';
import styles from './Process.module.css';

export function Process() {
  return (
    <section id="how" className={styles.how}>
      <div className={styles.inner}>
        <div>
          <div className="eyebrow">إزاي بنشتغل</div>
          <h2 className={styles.title}>
            من أول مكالمة
            <br />
            لحد ما الأوردر يدخل مخزنك.
          </h2>
          <p className={styles.lede}>
            من غير تسجيل ولا حساب. كلمنا وقولنا الكمية، ونرد عليك بعرض مكتوب أول بأول.
          </p>
        </div>

        <div className={styles.steps}>
          {processSteps.map((step) => (
            <div key={step.no} className={styles.step}>
              <div className={styles.no}>{step.no}</div>
              <div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
