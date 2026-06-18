"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useToast } from "@/components/ui/toast";
import { cartApi } from "@/lib/cart-client";
import type { Cart } from "@/types/cart";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`))
    ?.split("=")[1];
}

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  isOpen: boolean;
  count: number;
  openCart: () => void;
  closeCart: () => void;
  refresh: () => Promise<void>;
  /** Run a cart mutation and adopt the returned cart as the new state. */
  run: (fn: () => Promise<Cart>) => Promise<Cart>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setCart(await cartApi.get(readCookie("ic_currency")));
    } catch {
      // Network/auth hiccup — keep the last known cart.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Re-fetch when another part of the app asks (e.g. currency change).
  useEffect(() => {
    const handler = () => void refresh();
    window.addEventListener("ic:cart-refresh", handler);
    return () => window.removeEventListener("ic:cart-refresh", handler);
  }, [refresh]);

  const run = useCallback(
    async (fn: () => Promise<Cart>) => {
      try {
        const updated = await fn();
        setCart(updated);
        return updated;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Something went wrong.");
        throw e;
      }
    },
    [toast],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isOpen,
        count: cart?.item_count ?? 0,
        openCart,
        closeCart,
        refresh,
        run,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
