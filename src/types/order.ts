export type OrderLine = {
  id: string;
  sku: string;
  title: string;
  quantity: number;
  unit_price_charged: string;
  line_total_charged: string;
  fulfillment_type: string;
};

export type Order = {
  id: string;
  number: string;
  status: string;
  currency: string;
  base_currency: string;
  fx_rate_locked: string;
  total_base: string;
  total_charged: string;
  subtotal_charged: string;
  discount_charged: string;
  contact_email: string;
  payer_email: string;
  paid_by_label: string;
  ship_name: string;
  ship_city: string;
  ship_country: string;
  coupon_codes: string[];
  paid_at: string | null;
  created_at: string;
  lines: OrderLine[];
  shipments: {
    kind: string;
    status: string;
    tracking_number: string;
    carrier: string;
  }[];
  payment: {
    provider: string;
    intent_id: string;
    status: string;
    authorization_url?: string;
  } | null;
};

export type Shipping = {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
};
