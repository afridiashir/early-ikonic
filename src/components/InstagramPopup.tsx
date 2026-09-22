"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/ikonicdistro/?utm_source=site_popup";
// Permanent (localStorage) — set only once they actually click through to follow.
// Closing or "Not now" must NOT set this; the popup keeps coming back for those.
const FOLLOWED_KEY = "ig-followed";
const INITIAL_DELAY_MS = 4000;
const REPEAT_INTERVAL_MS = 60000;

// Fired elsewhere in the app (e.g. on a successful form submit) to pop this
// open right away, independent of the timer.
export const SHOW_INSTAGRAM_POPUP_EVENT = "ikonic:show-instagram-popup";

function hasFollowed(): boolean {
  try {
    return localStorage.getItem(FOLLOWED_KEY) === "1";
  } catch {
    return false;
  }
}

export default function InstagramPopup() {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = useCallback((delay: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (hasFollowed()) return;
    timerRef.current = setTimeout(() => {
      if (!hasFollowed()) setOpen(true);
    }, delay);
  }, []);

  useEffect(() => {
    scheduleNext(INITIAL_DELAY_MS);

    const showNow = () => {
      if (hasFollowed()) return;
      setOpen(true);
    };
    window.addEventListener(SHOW_INSTAGRAM_POPUP_EVENT, showNow);

    return () => {
      window.removeEventListener(SHOW_INSTAGRAM_POPUP_EVENT, showNow);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scheduleNext]);

  // Close without following — comes back in 60s.
  const snooze = () => {
    setOpen(false);
    scheduleNext(REPEAT_INTERVAL_MS);
  };

  // They actually clicked through — stop asking, for good.
  const follow = () => {
    try {
      localStorage.setItem(FOLLOWED_KEY, "1");
    } catch {
      // ignore — worst case it asks again next time
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="ig-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ig-popup-title"
      onClick={snooze}
    >
      <div className="ig-popup" onClick={(event) => event.stopPropagation()}>
        <button className="ig-popup-close" onClick={snooze} aria-label="Close">
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
          onClick={follow}
        >
          Follow @ikonicdistro &nbsp;→
        </a>
        <button className="ig-popup-skip" type="button" onClick={snooze}>
          Not now
        </button>
      </div>
    </div>
  );
}
