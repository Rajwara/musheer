import Link from "next/link";
import { getProduct } from "@/lib/catalog";
import { money } from "@/lib/format";
import { imageSrc, productImage } from "@/lib/images";
import "./most-wanted.css";

/** Best sellers shown: mostly kanduras and thobes, with real product photos where uploaded. */
const ITEMS = [
  { slug: "classic-round-collar-kandura-ivory", pill: "Kandura" },
  { slug: "stand-collar-thobe-white", pill: "Thobe" },
  { slug: "tailored-tasselled-kandura-sand", pill: "Kandura" },
  { slug: "breathable-cotton-thobe-white", pill: "Summer Thobe" },
  { slug: "occasion-bisht-black", pill: "Bisht", image: "images/categories/bisht" },
  { slug: "tailored-layering-jacket-charcoal", pill: "Jacket" },
];

/** "*Best Sellers / Most Wanted Right Now", from /test-mock-2: a heading beside a grid of best-selling products. */
export default function MostWanted() {
  const items = ITEMS.flatMap((it: { slug: string; pill: string; image?: string }) => {
    const p = getProduct(it.slug);
    return p ? [{ ...it, name: p.name, price: p.price }] : [];
  });

  return (
    <section className="mw" aria-labelledby="mw-title">
      <div className="mw-container mw-grid">
        <div className="mw-side">
          <span className="mw-label">*Best Sellers</span>
          <h2 id="mw-title">Most Wanted Right Now</h2>
          <div className="mw-end">
            <p>Our best-selling pieces, led by the kanduras and thobes our customers come back for season after season.</p>
            <Link className="mw-btn" href="/category/kandura-thobes">
              <span className="mw-roll">
                <span data-t="Shop Best Sellers">Shop Best Sellers</span>
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
              <span className="mw-pill">
                <i aria-hidden="true">★</i> Best seller · {it.pill}
              </span>
              <div className="mw-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image ? imageSrc(it.image) : productImage(it.slug)} alt={it.name} loading="lazy" />
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
