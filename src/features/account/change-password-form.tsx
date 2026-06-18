"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export function ChangePasswordForm() {
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (next.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      toast.error("New passwords don't match.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/proxy/auth/change-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: current,
          new_password: next,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Could not change password.");
      }
      toast.success("Password changed");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not change password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Current password
        </label>
        <Input
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            New password
          </label>
          <Input
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Confirm new password
          </label>
          <Input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Button
          type="button"
          variant="ghost"
          onClick={save}
          disabled={saving || !current || !next}
        >
          {saving ? "Updating…" : "Update password"}
        </Button>
      </div>
    </div>
  );
}
