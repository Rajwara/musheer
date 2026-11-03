import Link from "next/link";
import { Branches, HomeVisit, Services, Stats, WhoWeAre } from "@/components/BrandSections";
import CommunityVideos from "@/components/CommunityVideos";
import HeroSlider, { type Slide } from "@/components/HeroSlider";
import { ProductGrid } from "@/components/ProductCard";
import { COMMUNITY, HERO, HOME_VISIT_URL } from "@/lib/brand";
import { cards, home } from "@/lib/catalog";
import { imageSrc } from "@/lib/images";

const slides: Slide[] = [
  { eyebrow: HERO.eyebrow, title: HERO.title, text: HERO.text, cta: "Shop kanduras", href: "/category/kandura-thobes", image: imageSrc("images/hero/hero-adult") },
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

export default function HomePage() {
  const clips = COMMUNITY.clips.map((c) => ({ ...c, poster: imageSrc(c.poster), products: cards(c.products) }));
  return (
    <>
      <HeroSlider slides={slides} />
      <Stats />
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
          <a href={HOME_VISIT_URL} target="_blank" rel="noopener noreferrer">
            <b>Home tailoring</b>
            <small>We measure you at home or in your majlis.</small>
          </a>
          <Link href="/branches">
            <b>13 branches</b>
            <small>Across Abu Dhabi, Dubai, Sharjah, Ajman and Ras Al Khaimah.</small>
          </Link>
          <Link href="/about">
            <b>Since 1998</b>
            <small>A family craft, grown into a national name.</small>
          </Link>
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
      <WhoWeAre />
      <Services />
      <HomeVisit />
      <section>
        <div className="wrap">
          <div className="head">
            <h2>Featured</h2>
          </div>
          <ProductGrid products={cards(home.featured)} />
        </div>
      </section>
      <CommunityVideos eyebrow={COMMUNITY.eyebrow} text={COMMUNITY.text} instagram={COMMUNITY.instagram} clips={clips} />
      <Branches />
    </>
  );
}
