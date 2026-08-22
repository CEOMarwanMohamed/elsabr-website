import { CardStack } from './CardStack';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div>
        <div className={styles.pill}>
          <span className={styles.pillDot} aria-hidden="true" />
          التسليم في خلال يومين من الطلب — القاهرة، الجيزة، 6 أكتوبر، العبور
        </div>

        <h1 className={styles.title}>
          اللي شغلك محتاجه،
          <br />
          موجود عندنا دايمًا.
        </h1>

        <p className={styles.lede}>
          إحنا مورّد مستلزمات للشركات والمدارس والمستشفيات في مصر. اسمنا الصبر مش صدفة:
          بنفضل معاك بعد ما الأوردر يوصل.
        </p>

        <div className={styles.ctaRow}>
          <a href="#quote" className={styles.primary}>
            اطلب عرض سعر
          </a>
          <a href="#products" className={styles.secondary}>
            شوف المنتجات
          </a>
        </div>
      </div>

      <CardStack />
    </section>
  );
}
