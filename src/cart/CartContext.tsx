import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Product, ProductVariant } from '../data/catalog';

/** Same key the design canvas used, so an existing cart carries over. */
const STORAGE_KEY = 'sabr-cart-v1';
/** Shared with ProductCard so the two steppers cannot drift apart. */
export const MAX_QTY = 999;

export interface CartLine {
  code: string;
  name: string;
  unit: string;
  qty: number;
  /** Only on multi-size products. The code already identifies the size; this
      carries it in words so the order message and drawer can show it. */
  size?: string;
}

interface CartValue {
  lines: CartLine[];
  lineCount: number;
  unitCount: number;
  /** Increments on every add — drives the badge bump animation. */
  addTick: number;
  add: (product: Product, qty: number, variant?: ProductVariant) => void;
  setQty: (code: string, qty: number) => void;
  remove: (code: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartValue | null>(null);

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (i): i is CartLine =>
        !!i &&
        typeof i === 'object' &&
        typeof (i as CartLine).code === 'string' &&
        typeof (i as CartLine).name === 'string' &&
        typeof (i as CartLine).qty === 'number' &&
        (i as CartLine).qty > 0 &&
        ((i as CartLine).size === undefined ||
          typeof (i as CartLine).size === 'string'),
    );
  } catch {
    // Private mode, blocked storage, corrupt JSON — start empty.
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load);
  const [isOpen, setIsOpen] = useState(false);
  const [addTick, setAddTick] = useState(0);
  const firstRun = useRef(true);

  useEffect(() => {
    // Skip the write on mount so a blocked read can't clobber a good value.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Nothing to do — the cart still works for this session.
    }
  }, [lines]);

  const add = useCallback(
    (product: Product, qty: number, variant?: ProductVariant) => {
      // The variant's own code is the line key, so two sizes of one product
      // stay two lines instead of merging into an ambiguous one.
      const code = variant?.code ?? product.code;
      setLines((prev) => {
        const hit = prev.find((l) => l.code === code);
        if (hit) {
          return prev.map((l) =>
            l.code === code ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l,
          );
        }
        return [
          ...prev,
          {
            code,
            name: product.name,
            unit: product.unit,
            qty: Math.min(MAX_QTY, qty),
            ...(variant ? { size: variant.size } : {}),
          },
        ];
      });
      setAddTick((n) => n + 1);
    },
    [],
  );

  const setQty = useCallback((code: string, qty: number) => {
    setLines((prev) =>
      qty < 1
        ? prev.filter((l) => l.code !== code)
        : prev.map((l) => (l.code === code ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const remove = useCallback((code: string) => {
    setLines((prev) => prev.filter((l) => l.code !== code));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartValue>(
    () => ({
      lines,
      lineCount: lines.length,
      unitCount: lines.reduce((n, l) => n + l.qty, 0),
      addTick,
      add,
      setQty,
      remove,
      clear,
      isOpen,
      open,
      close,
    }),
    [lines, addTick, add, setQty, remove, clear, isOpen, open, close],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside a CartProvider');
  return ctx;
}
