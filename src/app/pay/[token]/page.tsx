import { ApiRequestError, backendFetch } from "@/lib/api";
import { PayForm } from "@/features/checkout/pay-form";
import type { SharedCart } from "@/types/cart";

export const metadata = { title: "Pay for a cart" };

function CenteredCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="container-site flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-ink/10 bg-white p-10 text-center shadow-card">
        <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-ink/60">{body}</p>
      </div>
    </div>
  );
}

type State =
  | { kind: "ok"; cart: SharedCart }
  | { kind: "gone"; message: string }
  | { kind: "notfound" };

async function resolve(token: string): Promise<State> {
  try {
    const cart = await backendFetch<SharedCart>(`/cart/shared/${token}/`);
    return { kind: "ok", cart };
  } catch (err) {
    if (err instanceof ApiRequestError) {
      if (err.status === 410) return { kind: "gone", message: err.message };
      if (err.status === 404) return { kind: "notfound" };
    }
    throw err;
  }
}

// Public "Pay for a Friend" landing page. A payer (guest or other user) lands
// here from a shared link, sees only contents + totals (no owner PII), and
// (Phase 6) completes payment on the owner's behalf.
export default async function PayPage({
  params,
}: {
  params: { token: string };
}) {
  const state = await resolve(params.token);

  if (state.kind === "notfound") {
    return (
      <CenteredCard
        title="Link not found"
        body="This shared cart link is invalid."
      />
    );
  }
  if (state.kind === "gone") {
    return <CenteredCard title="Link unavailable" body={state.message} />;
  }

  const { cart } = state;
  return (
    <div className="container-site max-w-2xl py-12">
      <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary">
          🎁 Pay for a Friend
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">
          You&apos;ve been asked to pay for this cart
        </h1>
        <p className="mt-1.5 text-sm text-ink/55">
          Complete payment without an account — the cart owner&apos;s details
          stay private, and the order ships to them.
        </p>

        <div className="mt-6 flex flex-col gap-2.5 rounded-2xl bg-blush p-5">
          {cart.lines.map((line) => (
            <div key={line.id} className="flex justify-between text-sm">
              <span className="text-ink/80">
                {line.product_title}{" "}
                <span className="text-ink/40">×{line.quantity}</span>
              </span>
              <span className="text-ink">{line.line_total.formatted}</span>
            </div>
          ))}
          {cart.discounts.applied.map((d) => (
            <div
              key={d.code}
              className="flex justify-between text-sm text-green-700"
            >
              <span>{d.code}</span>
              <span>−{d.amount_display.formatted}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-semibold text-ink">
            <span>Total</span>
            <span>{cart.total.formatted}</span>
          </div>
        </div>

        <PayForm token={cart.token} />
      </div>
    </div>
  );
}
