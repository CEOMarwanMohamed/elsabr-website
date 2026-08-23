import styles from './Clients.module.css';

const CLIENTS = [
  { name: 'Kellanova', src: '/assets/kellanova_logo.png' },
  { name: 'Speed Center', src: '/assets/speed_center_logo.png' },
  { name: 'Mavens Consulting', src: '/assets/mavens_logo.png' },
  { name: 'Sanipure', src: '/assets/sanipure_logo.png' },
];

/* The list is repeated until a group is wide enough to cover the viewport;
   drop this as more clients land. */
const REPEAT = 2;
const WALL = Array.from({ length: REPEAT }, () => CLIENTS).flat();

/**
 * Client logo wall. The marquee duplicates the group so the loop stays seamless;
 * add to CLIENTS as more land — the repeat count can drop as the list grows.
 */
export function Clients() {
  const group = (hidden: boolean) => (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {WALL.map((client, i) => (
        <div key={`${client.name}-${i}`} className={styles.slot}>
          <img
            src={client.src}
            alt={hidden || i >= CLIENTS.length ? '' : client.name}
            className={styles.logo}
            loading="lazy"
            decoding="async"
          />
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
