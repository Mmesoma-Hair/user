"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { cartApi } from "@/lib/cart-client";
import { checkoutApi } from "@/lib/checkout-client";
import type { Cart } from "@/types/cart";
import type { Order, Shipping } from "@/types/order";
import { OrderSummary } from "@/features/orders/order-summary";

const FIELDS: { key: keyof Shipping; label: string }[] = [
  { key: "name", label: "Full name" },
  { key: "line1", label: "Address line 1" },
  { key: "city", label: "City" },
  { key: "postal_code", label: "Postal code" },
  { key: "country", label: "Country (2-letter)" },
];

export function CheckoutForm() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [shipping, setShipping] = useState<Shipping>({});
  const [contactEmail, setContactEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  useEffect(() => {
    cartApi
      .get()
      .then(setCart)
      .catch(() => setCart(null));
  }, []);

  async function placeAndPay() {
    setBusy(true);
    try {
      const created = await checkoutApi.checkout({
        shipping,
        contact: contactEmail ? { email: contactEmail } : undefined,
      });
      // Cart was consumed by the order — refresh the header badge / drawer.
      window.dispatchEvent(new Event("ic:cart-refresh"));

      // Real gateway (Paystack/Flutterwave): redirect to hosted checkout. The
      // order is marked paid by the provider's webhook when payment completes.
      const authUrl = created.payment?.authorization_url;
      if (authUrl) {
        window.location.href = authUrl;
        return;
      }

      // Mock provider (dev): confirm inline.
      await checkoutApi.confirm(created.number);
      setOrder(await checkoutApi.getOrder(created.number).catch(() => created));
      toast.success("Order placed — payment confirmed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  }

  if (order) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h2 className="font-display text-3xl font-bold text-ink">
          Order confirmed
        </h2>
        <p className="mt-1 text-ink/55">
          Thank you! A confirmation is on its way to your inbox.
        </p>
        <div className="mt-6 text-left">
          <OrderSummary order={order} />
        </div>
        <Link
          href="/catalog"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 bg-white p-16 text-center">
        <p className="text-ink/60">Your cart is empty.</p>
        <Link
          href="/catalog"
          className="mt-4 inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">
          Shipping destination
        </h2>
        <p className="mb-5 mt-1 text-sm text-ink/55">
          Where should we send your order?
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div
              key={f.key}
              className={f.key === "line1" ? "sm:col-span-2" : ""}
            >
              <label className="mb-1.5 block text-sm font-medium text-ink">
                {f.label}
              </label>
              <Input
                value={shipping[f.key] ?? ""}
                onChange={(e) =>
                  setShipping((s) => ({ ...s, [f.key]: e.target.value }))
                }
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Contact email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink">Summary</h2>
        <div className="flex flex-col gap-1.5 text-sm">
          {cart.lines.map((l) => (
            <div key={l.id} className="flex justify-between">
              <span className="text-ink/70">
                {l.product_title}{" "}
                <span className="text-ink/40">×{l.quantity}</span>
              </span>
              <span className="text-ink">{l.line_total.formatted}</span>
            </div>
          ))}
        </div>
        {cart.discounts.applied.map((d) => (
          <div
            key={d.code}
            className="flex justify-between text-sm text-green-700"
          >
            <span>{d.code}</span>
            <span>−{d.amount_display.formatted}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-ink/10 pt-4 text-base font-semibold text-ink">
          <span>Total</span>
          <span>{cart.total.formatted}</span>
        </div>
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={placeAndPay}
          disabled={busy}
        >
          {busy ? "Processing…" : "Place order & pay"}
        </Button>
        <p className="text-center text-xs text-ink/45">
          Secure checkout · mock payment in dev
        </p>
      </aside>
    </div>
  );
}
