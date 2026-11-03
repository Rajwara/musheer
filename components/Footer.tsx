import Link from "next/link";
import { BRAND, PHONE_DISPLAY, PHONE_TEL, SOCIALS, WHATSAPP_URL } from "@/lib/brand";
import { footerNav } from "@/lib/navigation";
import Icon from "./Icon";

export function Socials() {
  return (
    <div className="socials">
      {SOCIALS.map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${BRAND} on ${s.name}`}>
          <Icon name={s.icon} size={18} />
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="cols">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="footer-logo" src="/logo-white.png" alt={BRAND} width={60} height={100} />
            <p style={{ marginTop: 16, maxWidth: 320 }}>
              The UAE&apos;s trusted name in kandura textile and tailoring since 1998, with 13 branches across 5 Emirates.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline" }}>
                WhatsApp
              </a>{" "}
              or call{" "}
              <a href={`tel:${PHONE_TEL}`} style={{ display: "inline", color: "#fff" }}>
                {PHONE_DISPLAY}
              </a>
            </p>
            <Socials />
          </div>
          {footerNav.map((col) => (
            <div key={col.heading}>
              <h4>{col.heading}</h4>
              {col.links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="legal">
          <span>
            &copy; {new Date().getFullYear()} {BRAND}. All rights reserved.
          </span>
          <span>Since 1998 · United Arab Emirates</span>
        </div>
      </div>
    </footer>
  );
}
