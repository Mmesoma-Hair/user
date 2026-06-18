import { redirect } from "next/navigation";

import { AccountNav } from "@/features/account/account-nav";
import { LogoutButton } from "@/features/auth/logout-button";
import { getSession } from "@/lib/session";

function initialsOf(name: string, email: string): string {
  const source = name.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  const letters =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : source.slice(0, 2);
  return letters.toUpperCase();
}

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="container-site py-10">
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="flex h-fit flex-col gap-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary text-base font-semibold text-blush">
              {initialsOf(user.full_name, user.email)}
            </div>
            <div className="min-w-0">
              <div className="truncate font-medium text-ink">
                {user.full_name || "Your account"}
              </div>
              <div className="truncate text-xs text-ink/55">{user.email}</div>
            </div>
          </div>

          <AccountNav />

          <div className="border-t border-ink/10 pt-4">
            <LogoutButton />
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
