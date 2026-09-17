import { Link } from 'react-router-dom';
import { whatsappChatUrl } from '../cart/order';
import { CardStack } from './CardStack';
import styles from './Hero.module.css';

export function Hero() {
  const whatsapp = whatsappChatUrl();

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

        {/* The hero's two actions: a WhatsApp chat and the catalogue.
            The WhatsApp number comes from site.ts, so there is one place to change. */}
        <div className={styles.ctaRow}>
          {/* The catalogue button stands alone if the number is not configured. */}
          {whatsapp && (
            <a
              href={whatsapp}
              className={styles.primary}
              target="_blank"
              rel="noopener noreferrer"
            >
              كلمنا على واتساب
            </a>
          )}
          <Link
            to="/catalog"
            className={whatsapp ? styles.secondary : styles.primary}
          >
            شوف الكتالوج
          </Link>
        </div>
      </div>

      <CardStack />
    </section>
  );
}
