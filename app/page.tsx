import Link from "next/link";
import HeroSlider, { type Slide } from "@/components/HeroSlider";
import { ProductGrid } from "@/components/ProductCard";
import { cards, home } from "@/lib/catalog";
import { imageSrc } from "@/lib/images";

const slides: Slide[] = [
  { eyebrow: "Kandura and thobes", title: "Everyday tradition, finely made", cta: "Shop kandura and thobes", href: "/category/kandura-thobes", image: imageSrc("images/hero/hero-adult") },
  { eyebrow: "Kids clothing", title: "Occasion wear for young gentlemen", cta: "Shop kids clothing", href: "/category/kids-clothing", image: imageSrc("images/hero/hero-kids") },
  { eyebrow: "Outerwear", title: "Warm layers for cooler evenings", cta: "Shop outerwear", href: "/category/kandura-jackets", image: imageSrc("images/hero/hero-winter") },
  { eyebrow: "New arrivals", title: "New season colours", cta: "Shop new arrivals", href: "/category/adult-thobes", image: imageSrc("images/hero/hero-new") },
];

const tiles = [
  { slug: "kandura-thobes", label: "Kandura and Thobes" },
  { slug: "kids-clothing", label: "Kids" },
  { slug: "bisht", label: "Bisht" },
  { slug: "shimagh-ghutra", label: "Headwear" },
  { slug: "arabic-sandals", label: "Sandals" },
  { slug: "perfumes", label: "Perfumes" },
  { slug: "saderi", label: "Saderi" },
  { slug: "wallets", label: "Wallets" },
];

const ribbon = [
  { title: "Delivery", text: "Add Musheer's delivery times here." },
  { title: "Returns", text: "Add Musheer's return terms here." },
  { title: "Support", text: "Add Musheer's contact hours here." },
];

export default function HomePage() {
  return (
    <>
      <HeroSlider slides={slides} />
      <section>
        <div className="wrap">
          <div className="head">
            <h2>Shop by category</h2>
            <Link href="/category/kandura-thobes">View all</Link>
          </div>
          <div className="mosaic">
            {tiles.map((t) => (
              <Link className="tile" key={t.slug} href={`/category/${t.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc(`images/categories/${t.slug}`)} alt={t.label} loading="lazy" />
                <span>{t.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="ribbon">
        <div className="wrap">
          {ribbon.map((r) => (
            <div key={r.title}>
              <b>{r.title}</b>
              <small>{r.text}</small>
            </div>
          ))}
        </div>
      </div>
      <section>
        <div className="wrap">
          <div className="head">
            <h2>Best sellers</h2>
            <Link href="/category/adult-thobes">View all</Link>
          </div>
          <ProductGrid products={cards(home.bestSellers)} />
        </div>
      </section>
      <section style={{ background: "var(--sand)" }}>
        <div className="wrap story">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc("images/content/story")} alt="Tailor measuring fabric" loading="lazy" />
          <div>
            <span className="eyebrow">Our story</span>
            <h2 style={{ margin: "12px 0 16px" }}>Made for how you dress</h2>
            <p>
              Replace this with Musheer&apos;s own story: who founded the store, where it began and what makes its
              garments different.
            </p>
            <Link className="btn ghost" href="/about">
              About Musheer
            </Link>
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <div className="head">
            <h2>Featured</h2>
          </div>
          <ProductGrid products={cards(home.featured)} />
        </div>
      </section>
    </>
  );
}
