"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { checkoutApi } from "@/lib/checkout-client";
import type { Order } from "@/types/order";
import { OrderSummary } from "@/features/orders/order-summary";

/**
 * Pay-for-a-Friend payer flow: a payer (guest or other user) completes payment
 * on a shared cart. Ownership stays with the cart owner on the backend.
 */
export function PayForm({ token }: { token: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function pay() {
    setBusy(true);
    try {
      const created = await checkoutApi.checkoutShared(token, {
        payer: email ? { email, name } : undefined,
      });
      const authUrl = created.payment?.authorization_url;
      if (authUrl) {
        window.location.href = authUrl; // real gateway → hosted checkout
        return;
      }
      await checkoutApi.confirm(created.number);
      setOrder(created);
      toast.success("Payment complete — thank you!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment failed.");
    } finally {
      setBusy(false);
    }
  }

  if (order) {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-green-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            ✓
          </span>
          <h2 className="font-display text-xl font-bold">
            Payment complete — thank you!
          </h2>
        </div>
        <OrderSummary order={order} />
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <p className="text-sm font-medium text-ink">Your details</p>
      <p className="-mt-2 text-xs text-ink/50">
        Paying as a guest? Enter your email (or sign in first).
      </p>
      <Input
        placeholder="Your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={pay}
        disabled={busy}
      >
        {busy ? "Processing…" : "Pay now"}
      </Button>
    </div>
  );
}
