import Link from "next/link";
import { BRAND, SOCIALS } from "@/lib/brand";
import { footerNav } from "@/lib/navigation";
import DIcon, { type IconName } from "./blog/Icons";
import NewsletterForm from "./blog/NewsletterForm";

const TRUST: { icon: IconName; text: string }[] = [
  { icon: "home", text: "Home tailoring visits" },
  { icon: "pin", text: "13 branches across the UAE" },
  { icon: "shield", text: "Tailoring since 1998" },
  { icon: "whatsapp", text: "Order on WhatsApp" },
];
const SOCIAL_ICON: Record<string, IconName> = { instagram: "instagram", tiktok: "tiktok", whatsapp: "whatsapp" };

/** Site footer, laid out from the blog/contact design. */
export default function Footer() {
  return (
    <div className="bl">
      <footer className="site-footer">
        <div className="trust-strip">
          <div className="container">
            <ul className="trust-list">
              {TRUST.map((t) => (
                <li className="trust-item" key={t.text}>
                  <DIcon name={t.icon} />
                  {t.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container footer-main">
          <div className="footer-brand">
            <Link href="/" aria-label={`${BRAND} home`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="footer-logo-img" src="/logo-white.png" alt={BRAND} width={354} height={593} />
            </Link>
            <p>The UAE&apos;s trusted name in kandura textile and tailoring since 1998, with 13 branches across 5 Emirates.</p>
            <div className="footer-title">Join our newsletter</div>
            <NewsletterForm />
            <div className="socials">
              {SOCIALS.map((s) => (
                <a key={s.name} className="social" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${BRAND} on ${s.name}`}>
                  <DIcon name={SOCIAL_ICON[s.icon]} />
                </a>
              ))}
            </div>
          </div>
          {footerNav.map((col, i) => (
            <div key={col.heading} className={i === footerNav.length - 1 ? "footer-col-last" : undefined}>
              <div className="footer-title">{col.heading}</div>
              <ul className="footer-links">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>
              &copy; {new Date().getFullYear()} {BRAND}. All rights reserved.
            </span>
            <a className="back-top" href="#top">
              Back to top <DIcon name="up" small />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
