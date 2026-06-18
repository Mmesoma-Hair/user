"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

/** Copies the canonical public share link (/p/<short_id>) to the clipboard. */
export function ShareButton({ sharePath }: { sharePath: string }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url = `${window.location.origin}${sharePath}`;
    try {
      if (navigator.share) {
        await navigator.share({ url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled share */
    }
  }

  return (
    <Button variant="ghost" onClick={onShare} type="button">
      {copied ? "Link copied!" : "Share"}
    </Button>
  );
}
