"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const COOKIE = "googtrans";

const isArabic = () => typeof document !== "undefined" && /googtrans=\/en\/ar/.test(document.cookie);

/** Set or clear Google Translate's language cookie on this host (and its parent domain). */
function setLang(ar: boolean) {
  const host = location.hostname;
  const parts = host.split(".");
  const domains = ["", host, parts.length > 2 ? "." + parts.slice(-2).join(".") : ""].filter((d, i, a) => a.indexOf(d) === i);
  for (const d of domains) {
    const dom = d ? `; domain=${d}` : "";
    document.cookie = ar ? `${COOKIE}=/en/ar; path=/${dom}` : `${COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${dom}`;
  }
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate: { TranslateElement: new (o: object, id: string) => unknown } };
  }
}

/**
 * English / العربية switch. Arabic uses Google's automatic translation of the
 * whole page (the choice is remembered in a cookie); English turns it off.
 */
export default function LanguageToggle() {
  const [ar, setAr] = useState(false);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => setAr(isArabic()), []);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const off = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", off);
    document.addEventListener("keydown", off);
    return () => {
      document.removeEventListener("pointerdown", off);
      document.removeEventListener("keydown", off);
    };
  }, [open]);

  const choose = (toAr: boolean) => {
    setOpen(false);
    if (toAr === ar) return;
    setLang(toAr);
    location.reload();
  };

  return (
    <>
      <div className="lang notranslate" translate="no" ref={box}>
        <button type="button" className="lang-btn" aria-haspopup="listbox" aria-expanded={open} aria-label={`Language: ${ar ? "Arabic" : "English"}`} onClick={() => setOpen((o) => !o)}>
          {ar ? "AR" : "EN"}
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {open && (
          <ul className="lang-menu" role="listbox" aria-label="Language">
            {[
              [false, "EN", "English"],
              [true, "AR", "العربية"],
            ].map(([v, code, name]) => (
              <li key={code as string} role="option" aria-selected={ar === v}>
                <button type="button" className={ar === v ? "on" : undefined} onClick={() => choose(v as boolean)}>
                  <b>{code as string}</b>
                  <span lang={v ? "ar" : "en"}>{name as string}</span>
                  {ar === v && (
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                      <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {ar && (
        <>
          <div id="google_translate_element" hidden />
          <Script id="gt-init" strategy="afterInteractive">
            {`window.googleTranslateElementInit=function(){new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'ar,en',autoDisplay:false},'google_translate_element');};`}
          </Script>
          <Script src="https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
        </>
      )}
    </>
  );
}
