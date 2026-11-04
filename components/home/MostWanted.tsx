import Link from "next/link";
import { getProduct } from "@/lib/catalog";
import { money } from "@/lib/format";
import { imageSrc } from "@/lib/images";
import "./most-wanted.css";

/** Products shown, with the same category photos as the /test-mock-2 section. */
const ITEMS = [
  { slug: "stitched-saderi-olive", pill: "Saderi", image: "images/categories/saderi" },
  { slug: "tailored-layering-jacket-charcoal", pill: "Jackets", image: "images/categories/kandura-jackets" },
  { slug: "occasion-bisht-black", pill: "Bisht", image: "images/categories/bisht" },
  { slug: "everyday-cotton-jalabiya-pale-blue", pill: "Jalabiya", image: "images/categories/jalabiya" },
  { slug: "relaxed-short-sleeve-tunic-stone", pill: "Casuals", image: "images/categories/arabian-casuals" },
  { slug: "breathable-cotton-thobe-white", pill: "Summer", image: "images/categories/summer-thobes" },
];

/** "*Collections / Most Wanted Right Now" from /test-mock-2: a sticky heading beside a grid of product cards. */
export default function MostWanted() {
  const items = ITEMS.flatMap((it) => {
    const p = getProduct(it.slug);
    return p ? [{ ...it, name: p.name, price: p.price }] : [];
  });

  return (
    <section className="mw" aria-labelledby="mw-title">
      <div className="mw-container mw-grid">
        <div className="mw-side">
          <span className="mw-label">*Collections</span>
          <h2 id="mw-title">Most Wanted Right Now</h2>
          <div className="mw-end">
            <p>Our most-loved pieces this season, from saderi and jackets to bisht and summer thobes.</p>
            <Link className="mw-btn" href="/category/kandura-thobes">
              <span className="mw-roll">
                <span data-t="Explore All">Explore All</span>
              </span>
              <span className="mw-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12h16M14 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
        <div className="mw-products">
          {items.map((it) => (
            <Link className="mw-product" key={it.slug} href={`/product/${it.slug}`}>
              <span className="mw-pill">{it.pill}</span>
              <div className="mw-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc(it.image)} alt="" loading="lazy" />
              </div>
              <div className="mw-name">{it.name}</div>
              <div className="mw-price">{money(it.price)}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
