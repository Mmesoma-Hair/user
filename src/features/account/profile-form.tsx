"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import type { User } from "@/types/auth";

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const toast = useToast();
  const [fullName, setFullName] = useState(user.full_name);
  const [phone, setPhone] = useState(user.profile.phone);
  const [marketing, setMarketing] = useState(user.profile.marketing_opt_in);
  const [saving, setSaving] = useState(false);

  const dirty =
    fullName !== user.full_name ||
    phone !== user.profile.phone ||
    marketing !== user.profile.marketing_opt_in;

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/proxy/auth/me/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          marketing_opt_in: marketing,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Could not save your profile.");
      }
      toast.success("Profile updated");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Full name
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Phone
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Optional"
            autoComplete="tel"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input
          type="checkbox"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
        />
        Send me occasional offers and product news
      </label>

      <div>
        <Button type="button" onClick={save} disabled={saving || !dirty}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
