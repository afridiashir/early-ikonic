"use client";

import { useEffect, useState } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/ikonicdistro/?utm_source=site_popup";
const DISMISS_KEY = "ig-popup-dismissed";
const SHOW_DELAY_MS = 4000;

export default function InstagramPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setOpen(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  if (!open) return null;

  return (
    <div
      className="ig-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ig-popup-title"
      onClick={dismiss}
    >
      <div className="ig-popup" onClick={(event) => event.stopPropagation()}>
        <button className="ig-popup-close" onClick={dismiss} aria-label="Close">
          ×
        </button>
        <div className="ig-popup-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-9.6a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" />
          </svg>
        </div>
        <h3 id="ig-popup-title">Follow us on Instagram</h3>
        <p>Drops, updates, and behind-the-scenes — @ikonicdistro, before anyone else.</p>
        <a
          className="btn"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
        >
          Follow @ikonicdistro &nbsp;→
        </a>
        <button className="ig-popup-skip" type="button" onClick={dismiss}>
          Not now
        </button>
      </div>
    </div>
  );
}
