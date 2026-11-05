import Link from "next/link";
import { imageSrc } from "@/lib/images";
import "./not-found.css";

const POPULAR = [
  { label: "Kandura and Thobes", href: "/category/kandura-thobes" },
  { label: "Kids", href: "/category/kids-clothing" },
  { label: "Bisht", href: "/category/bisht" },
  { label: "Headwear", href: "/category/shimagh-ghutra" },
  { label: "Branches", href: "/branches" },
  { label: "Contact", href: "/contact" },
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

/** 404 message in the /test-mock-2 branding, used for unknown addresses and missing products or posts. */
export default function NotFoundContent() {
  return (
    <section className="nf" aria-labelledby="nf-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="nf-bg" src={imageSrc("images/pages/branches")} alt="" />
      <div className="nf-in">
        <span className="nf-label">*Error 404</span>
        <p className="nf-code" aria-hidden="true">
          404
        </p>
        <h1 id="nf-title">This page has wandered off</h1>
        <p className="nf-text">The page you&apos;re looking for doesn&apos;t exist or has moved. Try a search, or pick up from one of these.</p>

        <form className="nf-search" action="/search" role="search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input name="q" type="search" placeholder="Search kanduras, ghutra, sandals…" aria-label="Search products" />
          <button type="submit">Search</button>
        </form>

        <div className="nf-btns">
          <Link className="nf-btn" href="/">
            Back to home
            <span className="nf-ico">
              <Arrow />
            </span>
          </Link>
          <Link className="nf-btn nf-btn-line" href="/shop">
            Shop all categories
            <span className="nf-ico">
              <Arrow />
            </span>
          </Link>
        </div>

        <div className="nf-popular">
          <small>Popular</small>
          {POPULAR.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
