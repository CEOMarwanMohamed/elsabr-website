import styles from './Clients.module.css';

const SLOTS = 8;

/**
 * Placeholder logo wall. Swap each slot for a real client logo when they land —
 * the marquee duplicates the group so the loop stays seamless.
 */
export function Clients() {
  const group = (hidden: boolean) => (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {Array.from({ length: SLOTS }, (_, i) => (
        <div key={i} className={styles.slot}>
          لوجو عميل
        </div>
      ))}
    </div>
  );

  return (
    <section id="clients" className={styles.clients}>
      <div className={styles.head}>
        <p>عملاء بيثقوا فينا</p>
        <a href="#quote">انضم لهم ←</a>
      </div>
      <div className={styles.viewport}>
        <div className={styles.track}>
          {group(false)}
          {group(true)}
        </div>
      </div>
    </section>
  );
}
