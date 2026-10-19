"use client";

import { useState } from "react";

export default function PromoCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — code is still visible to copy by hand.
    }
  };

  return (
    <div className="promo-chip">
      <code>{code}</code>
      <button type="button" className={copied ? "copied" : undefined} onClick={copy}>
        {copied ? "Copied!" : "Copy code"}
      </button>
    </div>
  );
}
