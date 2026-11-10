"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OFFER } from "@/lib/brand";
import "./offer-popup.css";
import BtnContent from "./ui/BtnContent";

const KEY = "offer-popup";
const TEASER_OFF = "offer-teaser-off";

type Saved = { deadline: number; closedAt?: number; joined?: boolean };

function readSaved(): Saved | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "null");
  } catch {
    return null;
  }
}

function writeSaved(s: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Storage blocked: the popup simply may show again next visit.
  }
}

function teaserDismissed() {
  try {
    return sessionStorage.getItem(TEASER_OFF) === "1";
  } catch {
    return false;
  }
}

const pad = (n: number) => String(n).padStart(2, "0");

const Cross = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Welcome-offer popup in the /test-mock-2 branding: a photo panel beside a
 * short offer, a live countdown chip and a pill email field. After it is
 * closed, a small "Get your welcome offer" tab stays in the corner so it can
 * be reopened.
 */
export default function OfferPopup({ image }: { image: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const saved = useRef<Saved | null>(null);
  const [left, setLeft] = useState(OFFER.minutes * 60);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [email, setEmail] = useState("");
  const [teaser, setTeaser] = useState(false);

  const open = useCallback(() => {
    const d = dialog.current;
    if (d && !d.open) {
      d.showModal();
      setTeaser(false);
    }
  }, []);

  // Decide whether to show the popup (or just the teaser tab), and when.
  useEffect(() => {
    const now = Date.now();
    let s = readSaved();
    if (s?.joined) return;
    const snoozed = s?.closedAt && now - s.closedAt < OFFER.hideForDays * 86_400_000;
    if (!s || s.deadline < now) s = { ...s, deadline: now + OFFER.minutes * 60_000 };
    saved.current = s;
    writeSaved(s);

    if (snoozed) {
      if (teaserDismissed()) return;
      const t = setTimeout(() => setTeaser(true), OFFER.delaySeconds * 1000);
      return () => clearTimeout(t);
    }

    const timer = setTimeout(open, OFFER.delaySeconds * 1000);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) open();
    };
    document.addEventListener("mouseleave", onLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [open]);

  // Countdown.
  useEffect(() => {
    const tick = () => {
      if (saved.current) setLeft(Math.max(0, Math.round((saved.current.deadline - Date.now()) / 1000)));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const close = () => dialog.current?.close();

  const onClosed = () => {
    if (saved.current && !saved.current.joined) {
      saved.current = { ...saved.current, closedAt: Date.now() };
      writeSaved(saved.current);
      if (!teaserDismissed()) setTeaser(true);
    }
  };

  const hideTeaser = () => {
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_OFF, "1");
    } catch {
      // Storage blocked: the tab just comes back on the next page load.
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "offer-popup" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      saved.current = { ...(saved.current ?? { deadline: Date.now() }), joined: true };
      writeSaved(saved.current);
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <dialog
        ref={dialog}
        className="op"
        aria-labelledby="op-title"
        onClose={onClosed}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="op-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" loading="lazy" />
          <span className="op-media-tag">*Est. 1998 · UAE</span>
          <span className="op-media-mark notranslate" translate="no" aria-hidden="true">
            AL MUSHEER
          </span>
        </div>

        <div className="op-body">
          <button className="op-close" type="button" aria-label="Close" onClick={close}>
            <Cross />
          </button>

          {status === "done" ? (
            <div className="op-done">
              <span className="op-check" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24">
                  <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="op-eyebrow">*You&apos;re in</span>
              <h2 id="op-title">Welcome to Al Musheer</h2>
              <p>
                Your exclusive discount is on its way to <b>{email}</b>.
              </p>
              <button className="op-btn am-btn" type="button" onClick={close}>
                <BtnContent label="Continue shopping" />
              </button>
            </div>
          ) : (
            <>
              <span className="op-eyebrow">*{OFFER.eyebrow}</span>
              <h2 id="op-title">{OFFER.title}</h2>
              <p className="op-text">{OFFER.text}</p>

              {left > 0 && (
                <div className="op-timer" role="timer" aria-label={`Offer ends in ${Math.floor(left / 60)} minutes ${left % 60} seconds`}>
                  <span className="op-live" aria-hidden="true" />
                  Offer ends in
                  <b>
                    {pad(Math.floor(left / 60))}:{pad(left % 60)}
                  </b>
                </div>
              )}

              <form className="op-form" onSubmit={submit}>
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  aria-label="Email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="op-btn am-btn" type="submit" disabled={status === "sending"}>
                  <BtnContent label={status === "sending" ? "Sending…" : "Claim offer"} />
                </button>
              </form>
              {status === "error" && <p className="op-error">Something went wrong. Please try again.</p>}

              <ul className="op-points">
                {OFFER.points.slice(0, 3).map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>

              <button className="op-skip" type="button" onClick={close}>
                No thanks, I&apos;ll pay full price
              </button>
            </>
          )}
        </div>
      </dialog>

      {teaser && (
        <div className="op-teaser">
          <button type="button" className="op-teaser-open" onClick={open}>
            <span className="op-live" aria-hidden="true" />
            {OFFER.teaser}
          </button>
          <button type="button" className="op-teaser-x" aria-label="Hide offer" onClick={hideTeaser}>
            <Cross size={12} />
          </button>
        </div>
      )}
    </>
  );
}
