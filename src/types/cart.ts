import type { MoneyDisplay } from "./catalog";

export type CartLine = {
  id: string;
  variant: string;
  sku: string;
  product_title: string;
  product_slug?: string;
  image?: string | null;
  quantity: number;
  unit_price: MoneyDisplay;
  line_total: MoneyDisplay;
  price_changed: boolean;
  in_stock: boolean;
};

export type CartIssue = {
  line: string;
  sku: string;
  code: string;
  available?: number;
  requested?: number;
  was?: string;
  now?: string;
};

export type AppliedDiscount = {
  code: string;
  type: string;
  amount: string;
  amount_display: MoneyDisplay;
};

export type Cart = {
  id: string;
  currency: string;
  base_currency: string;
  lines: CartLine[];
  subtotal: MoneyDisplay;
  discounts: { applied: AppliedDiscount[]; total: MoneyDisplay };
  total: MoneyDisplay;
  item_count: number;
  issues: CartIssue[];
  share: {
    is_shared: boolean;
    token: string | null;
    expires_at: string | null;
    allow_payer_to_set_shipping: boolean;
  };
};

/** The sanitized public shared-cart payload (no owner PII). */
export type SharedCart = {
  token: string;
  currency: string;
  base_currency: string;
  lines: CartLine[];
  subtotal: MoneyDisplay;
  discounts: { applied: AppliedDiscount[]; total: MoneyDisplay };
  total: MoneyDisplay;
  item_count: number;
  allow_payer_to_set_shipping: boolean;
};
