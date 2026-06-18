import Link from "next/link";

import { RegisterForm } from "@/features/auth/register-form";
import { getStoreConfig } from "@/lib/config";

export const metadata = { title: "Create account" };

export default async function RegisterPage() {
  const { name } = await getStoreConfig();
  return (
    <div className="container-site flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-3xl border border-ink/10 bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl font-bold text-ink">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-ink/55">
          Start shopping with {name}.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-accent"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
