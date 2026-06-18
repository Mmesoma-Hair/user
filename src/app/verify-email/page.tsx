import { Suspense } from "react";

import { VerifyEmail } from "@/features/account/verify-email";

export const metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-8">
      <Suspense>
        <VerifyEmail />
      </Suspense>
    </main>
  );
}
