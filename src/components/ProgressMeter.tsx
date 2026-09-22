"use client";

import { useEffect, useRef, useState } from "react";

type Props = { joined: number; goal: number };

export default function ProgressMeter({ joined, goal }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [barWidth, setBarWidth] = useState("0%");

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      setBarWidth(`${Math.min((joined / goal) * 100, 100)}%`);
      if (reduceMotion) {
        setCount(joined);
        return;
      }
      let start: number | null = null;
      const tick = (ts: number) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / 1400, 1);
        setCount(Math.floor(joined * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
        else setCount(joined);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [joined, goal]);

  const remaining = Math.max(goal - joined, 0);

  return (
    <div ref={sectionRef}>
      <div className="progress-label">Early Access Registrations</div>
      <div className="progress-num">
        <span>{count.toLocaleString("en-US")}</span> <span>/ {goal.toLocaleString("en-US")}</span>
      </div>
      <div className="bar">
        <i style={{ width: barWidth }} />
      </div>
      <div className="progress-meta">
        <span>
          <strong style={{ color: "#fff" }}>{joined.toLocaleString("en-US")}</strong> joined
        </span>
        <span>
          <strong style={{ color: "#fff" }}>{remaining.toLocaleString("en-US")}</strong> remaining
        </span>
      </div>
    </div>
  );
}
