"use client";

import BtnContent from "@/components/ui/BtnContent";
import { useState } from "react";

/**
 * Sign in / create account card. Accounts are not connected to a backend
 * yet, so submitting shows a notice instead of signing in.
 */
export default function AccountForms() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [sent, setSent] = useState(false);

  return (
    <div className="ac-card">
      <div className="ac-tabs" role="tablist" aria-label="Account">
        {[
          ["in", "Sign in"],
          ["up", "Create account"],
        ].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={mode === id} className={mode === id ? "on" : undefined} onClick={() => (setMode(id as "in" | "up"), setSent(false))}>
            {label}
          </button>
        ))}
      </div>
      <h2>{mode === "in" ? "Welcome back" : "Join Al Musheer"}</h2>
      <p className="ac-sub">{mode === "in" ? "Sign in to see your orders, saved measurements and saved pieces." : "Save your measurements, track orders and get early access to new fabrics."}</p>
      <form
        className="ac-form"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        {mode === "up" && (
          <label>
            <span>Full name</span>
            <input name="name" autoComplete="name" required />
          </label>
        )}
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        {mode === "up" && (
          <label>
            <span>Mobile (optional)</span>
            <input name="tel" type="tel" autoComplete="tel" placeholder="+971" />
          </label>
        )}
        <label>
          <span>Password</span>
          <input name="password" type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} required />
        </label>
        {mode === "in" && (
          <button type="button" className="ac-link" onClick={() => setSent(true)}>
            Forgot password?
          </button>
        )}
        <button className="am-btn" type="submit">
          <BtnContent label={mode === "in" ? "Sign in" : "Create account"} />
        </button>
        {sent && <p className="ac-note">Accounts aren&apos;t active yet. Until they are, message us on WhatsApp for orders, measurements and home visits.</p>}
      </form>
    </div>
  );
}
