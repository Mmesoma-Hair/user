import { CheckoutForm } from "@/features/checkout/checkout-form";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-site max-w-4xl py-10">
      <h1 className="mb-8 font-display text-4xl font-bold text-ink">
        Checkout
      </h1>
      <CheckoutForm />
    </div>
  );
}
