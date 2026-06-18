"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/** Compact header search — submits to /catalog?search=… */
export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("search") ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(
      term ? `/catalog?search=${encodeURIComponent(term)}` : "/catalog",
    );
  }

  return (
    <form
      onSubmit={submit}
      className="hidden flex-1 items-center md:flex"
      role="search"
    >
      <div className="relative w-full max-w-sm">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m20 20-3-3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="h-9 w-full rounded-full border border-ink/15 bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
      </div>
    </form>
  );
}
