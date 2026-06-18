import { CartView } from "@/features/cart/cart-view";

export const metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <div className="container-site py-10">
      <h1 className="mb-8 font-display text-4xl font-bold text-ink">
        Your cart
      </h1>
      <CartView />
    </div>
  );
}
