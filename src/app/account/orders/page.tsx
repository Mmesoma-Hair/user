import { OrderHistory } from "@/features/orders/order-history";

export const metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-bold text-ink">Orders</h1>
      <OrderHistory />
    </div>
  );
}
