import { NextResponse } from "next/server";

import { CURRENCY_COOKIE } from "@/lib/currency";

/** Persist the shopper's chosen display currency in a cookie. */
export async function POST(request: Request) {
  const { code } = (await request.json().catch(() => ({}))) as {
    code?: string;
  };
  if (!code || !/^[A-Za-z]{3}$/.test(code)) {
    return NextResponse.json(
      { error: "Invalid currency code." },
      { status: 400 },
    );
  }
  const res = NextResponse.json({ ok: true, code: code.toUpperCase() });
  res.cookies.set(CURRENCY_COOKIE, code.toUpperCase(), {
    httpOnly: false, // readable by client UI; not sensitive
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
