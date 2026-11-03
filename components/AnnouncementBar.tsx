"use client";

import { useEffect, useState } from "react";
import { ANNOUNCEMENTS } from "@/lib/brand";
import Icon from "./Icon";

export default function AnnouncementBar() {
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = ANNOUNCEMENTS.length;

  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setAt((i) => (i + 1) % n), 5000);
    return () => clearInterval(t);
  }, [paused, n, at]);

  const msg = ANNOUNCEMENTS[at];
  const text = (
    <>
      <Icon name={msg.icon} size={16} />
      <span>{msg.text}</span>
    </>
  );

  return (
    <div className="announce" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <button type="button" aria-label="Previous message" onClick={() => setAt((i) => (i - 1 + n) % n)}>
        <Icon name="left" size={16} />
      </button>
      <div className="announce-msg" aria-live="polite" key={at}>
        {msg.href ? (
          <a href={msg.href} target={msg.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {text}
          </a>
        ) : (
          text
        )}
      </div>
      <button type="button" aria-label="Next message" onClick={() => setAt((i) => (i + 1) % n)}>
        <Icon name="right" size={16} />
      </button>
    </div>
  );
}
