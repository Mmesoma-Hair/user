"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useToast } from "@/components/ui/toast";
import type { ProductListItem } from "@/types/catalog";

const STORAGE_KEY = "ic_favourites";

export type FavouriteItem = {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  price: string | null;
  defaultVariant: string | null;
  hasOptions: boolean;
};

type FavouritesContextValue = {
  items: FavouriteItem[];
  count: number;
  isFavourite: (id: string) => boolean;
  toggle: (product: ProductListItem) => void;
  remove: (id: string) => void;
};

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const toast = useToast();
  const [items, setItems] = useState<FavouriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as FavouriteItem[]);
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration so we don't clobber stored data).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / unavailable */
    }
  }, [items, hydrated]);

  const isFavourite = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items],
  );

  const toggle = useCallback(
    (product: ProductListItem) => {
      setItems((cur) => {
        if (cur.some((i) => i.id === product.id)) {
          toast.info("Removed from favourites");
          return cur.filter((i) => i.id !== product.id);
        }
        toast.success("Added to favourites");
        return [
          ...cur,
          {
            id: product.id,
            slug: product.slug,
            title: product.title,
            image: product.primary_image?.card ?? null,
            price: product.price_from_display?.formatted ?? product.price_from,
            defaultVariant: product.default_variant,
            hasOptions: product.has_options,
          },
        ];
      });
    },
    [toast],
  );

  const remove = useCallback((id: string) => {
    setItems((cur) => cur.filter((i) => i.id !== id));
  }, []);

  const value = useMemo(
    () => ({ items, count: items.length, isFavourite, toggle, remove }),
    [items, isFavourite, toggle, remove],
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites(): FavouritesContextValue {
  const ctx = useContext(FavouritesContext);
  if (!ctx)
    throw new Error("useFavourites must be used within a FavouritesProvider");
  return ctx;
}
