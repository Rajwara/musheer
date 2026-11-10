"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

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
  useEffect(() => setAr(isArabic()), []);

  const toggle = () => {
    setLang(!ar);
    location.reload();
  };

  return (
    <>
      <button type="button" className="lang-toggle notranslate" translate="no" onClick={toggle} aria-label={ar ? "Switch to English" : "التبديل إلى العربية (Switch to Arabic)"} lang={ar ? "en" : "ar"}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
        </svg>
        <span className="lang-long">{ar ? "English" : "العربية"}</span>
        <span className="lang-short" aria-hidden="true">{ar ? "EN" : "ع"}</span>
      </button>
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
