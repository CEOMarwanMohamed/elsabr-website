import { useState } from 'react';
import { MAX_QTY } from '../cart/CartContext';
import styles from './QtyStepper.module.css';

/** Arabic-Indic and Persian digits, so a typed ٢٥ counts as 25. */
function toAsciiDigits(raw: string): string {
  return raw.replace(/[٠-٩۰-۹]/g, (d) =>
    String(
      (d.charCodeAt(0) >= 0x06f0 ? d.charCodeAt(0) - 0x06f0 : d.charCodeAt(0) - 0x0660),
    ),
  );
}

interface Props {
  value: number;
  /**
   * Receives the requested quantity. The minus button can pass value - 1 (so
   * zero is possible) and the caller decides what that means — the card floors
   * at 1, the cart drawer treats it as "remove this line". Typed values are
   * already clamped to 1..MAX_QTY.
   */
  onChange: (qty: number) => void;
  /** Names the thing being counted, for screen readers. */
  label: string;
  /** Slightly tighter, for the cart drawer's list. */
  compact?: boolean;
}

export function QtyStepper({ value, onChange, label, compact }: Props) {
  // Held only while the field is focused, so it can sit empty mid-edit
  // without the committed quantity jumping around.
  const [draft, setDraft] = useState<string | null>(null);

  const handleInput = (raw: string) => {
    const digits = toAsciiDigits(raw).replace(/\D/g, '').slice(0, 3);
    setDraft(digits);
    if (digits) onChange(Math.max(1, Math.min(MAX_QTY, Number(digits))));
  };

  return (
    <div className={`${styles.stepper} ${compact ? styles.compact : ''}`}>
      <button
        type="button"
        className={styles.step}
        onClick={() => onChange(value - 1)}
        aria-label={`أقل — ${label}`}
      >
        −
      </button>

      <input
        className={styles.value}
        // A number input shows spinners and rejects Arabic digits; this pairs
        // a text field with the numeric keypad on phones instead.
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={draft ?? String(value)}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={(e) => e.currentTarget.select()}
        onBlur={() => setDraft(null)}
        aria-label={`الكمية — ${label}`}
      />

      <button
        type="button"
        className={styles.step}
        onClick={() => onChange(value + 1)}
        aria-label={`أكثر — ${label}`}
      >
        +
      </button>
    </div>
  );
}
