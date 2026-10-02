import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  key: string;
  productId?: string;
  name: string;
  detail?: string;
  price: number; // 0 si "sur devis" — le devis se négocie après envoi
  qty: number;
  image?: string;
  size?: string;
  color?: string;
  customization?: string; // texte/logo/numéro demandé par le client
  isQuote?: boolean;
};

type Toast = { id: number; msg: string };

type Store = {
  cart: CartItem[];
  cartOpen: boolean;
  toasts: Toast[];
  cartCount: number;
  cartTotal: number;
  setCartOpen: (v: boolean) => void;
  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  toast: (msg: string) => void;
};

const Ctx = createContext<Store | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => load("shoppro_cart", []));
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem("shoppro_cart", JSON.stringify(cart));
  }, [cart]);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const addToCart = useCallback(
    (item: Omit<CartItem, "qty">, qty = 1) => {
      setCart((c) => {
        const existing = c.find((i) => i.key === item.key);
        if (existing)
          return c.map((i) => (i.key === item.key ? { ...i, qty: i.qty + qty } : i));
        return [...c, { ...item, qty }];
      });
      toast(`${item.name} — ajouté à votre commande`);
      setCartOpen(true);
    },
    [toast]
  );

  const updateQty = useCallback((key: string, delta: number) => {
    setCart((c) =>
      c
        .map((i) => (i.key === key ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setCart((c) => c.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  const value: Store = {
    cart,
    cartOpen,
    toasts,
    cartCount,
    cartTotal,
    setCartOpen,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    toast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used within StoreProvider");
  return s;
}
