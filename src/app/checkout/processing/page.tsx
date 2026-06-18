import { PaymentProcessing } from "@/features/checkout/payment-processing";

export const metadata = { title: "Confirming payment" };

export default function ProcessingPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return <PaymentProcessing orderNumber={searchParams.order ?? ""} />;
}
