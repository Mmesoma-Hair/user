"use client";

import { useCart } from "@/features/cart/cart-context";

/** Cart icon with a live item-count badge. Opens the slide-in cart drawer. */
export function CartBadge() {
  const { count, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Open cart"
      className="relative inline-flex h-9 w-9 items-center justify-center text-ink transition hover:bg-ink/5"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 7h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M9 7a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
