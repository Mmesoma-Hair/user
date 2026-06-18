"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { checkoutApi } from "@/lib/checkout-client";
import type { Order } from "@/types/order";
import { OrderSummary } from "./order-summary";

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkoutApi
      .history()
      .then(setOrders)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load orders."),
      );
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!orders)
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border border-ink/10 bg-white p-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-3 w-24" />
            <Skeleton className="mt-4 h-3 w-full" />
          </div>
        ))}
      </div>
    );
  if (orders.length === 0)
    return (
      <div className="border border-dashed border-ink/15 bg-white p-12 text-center">
        <p className="text-ink/60">You have no orders yet.</p>
        <Link
          href="/catalog"
          className="mt-4 inline-flex h-11 items-center bg-accent px-6 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          Start shopping
        </Link>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {orders.map((o) => (
        <OrderSummary key={o.id} order={o} />
      ))}
    </div>
  );
}
