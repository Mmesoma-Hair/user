import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
} from "@/lib/auth-cookies";
import { env } from "@/lib/env";

// Routes that require an authenticated session. (Admin is a separate app.)
const PROTECTED_PREFIXES = ["/account"];

function decodeClaims(jwt: string): { exp?: number } {
  try {
    const [, payload] = jwt.split(".");
    return JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
  } catch {
    return {};
  }
}

function isExpired(jwt: string): boolean {
  const { exp } = decodeClaims(jwt);
  if (!exp) return true;
  // Treat as expired 10s early to avoid races.
  return exp * 1000 <= Date.now() + 10_000;
}

function loginRedirect(request: NextRequest): NextResponse {
  const url = new URL("/login", request.url);
  url.searchParams.set("next", request.nextUrl.pathname);
  const res = NextResponse.redirect(url);
  res.cookies.delete(ACCESS_COOKIE);
  res.cookies.delete(REFRESH_COOKIE);
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  let access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  const response = NextResponse.next();

  // Ensure a fresh access token, rotating via the refresh cookie if needed.
  if (!access || isExpired(access)) {
    if (!refresh) return loginRedirect(request);
    try {
      const apiRes = await fetch(`${env.serverApiBaseUrl}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!apiRes.ok) return loginRedirect(request);
      const data = (await apiRes.json()) as { access: string; refresh?: string };
      access = data.access;
      response.cookies.set(ACCESS_COOKIE, data.access, accessCookieOptions());
      if (data.refresh) {
        response.cookies.set(REFRESH_COOKIE, data.refresh, refreshCookieOptions());
      }
    } catch {
      return loginRedirect(request);
    }
  }

  return response;
}

export const config = {
  matcher: ["/account/:path*"],
};
