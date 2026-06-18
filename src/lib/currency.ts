import "server-only";

import { cookies } from "next/headers";

import { backendFetch } from "./api";

export const CURRENCY_COOKIE = "ic_currency";

export type CurrencyInfo = {
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
};

export type MoneyDisplay = {
  base_amount: string;
  base_currency: string;
  currency: string;
  amount: string;
  formatted: string;
  rate: string;
  converted: boolean;
};

/** The shopper's selected display currency (cookie), validated server-side. */
export function selectedCurrency(): string | undefined {
  return cookies().get(CURRENCY_COOKIE)?.value;
}

export async function getCurrencies(): Promise<{
  base: string;
  currencies: CurrencyInfo[];
}> {
  return backendFetch("/currency/");
}
