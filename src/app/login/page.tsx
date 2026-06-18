import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/features/auth/login-form";
import { getStoreConfig } from "@/lib/config";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const { name } = await getStoreConfig();
  return (
    <div className="container-site flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-3xl border border-ink/10 bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl font-bold text-ink">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-ink/55">
          Sign in to your {name} account.
        </p>
        <div className="mt-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-sm text-ink/60">
          No account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-accent"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
