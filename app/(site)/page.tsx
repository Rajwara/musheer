import Link from "next/link";
import { HomeVisit, Services, Stats, WhoWeAre } from "@/components/BrandSections";
import Marquee from "@/components/Marquee";
import HeroSlider, { type Slide } from "@/components/HeroSlider";
import MostWanted from "@/components/home/MostWanted";
import FindYourFit from "@/components/home/FindYourFit";
import FeaturedLooks, { type Look } from "@/components/home/FeaturedLooks";
import NewArrivals from "@/components/home/NewArrivals";
import WhatWeStandFor from "@/components/home/WhatWeStandFor";
import BehindTheCraft from "@/components/home/BehindTheCraft";
import MadeToMeasure from "@/components/home/MadeToMeasure";
import { ProductGrid } from "@/components/ProductCard";
import { HERO, HOME_VISIT_URL, PHONE_DISPLAY } from "@/lib/brand";
import { cards, getCategory, getProduct, home } from "@/lib/catalog";
import { imageSrc, productImage } from "@/lib/images";

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

/** Pinned photo stack after "Find Your Fit": same photos and products as /test-mock-2, thobes first. */
const LOOKS = [
  { photo: "images/hero/hero-adult", slug: "breathable-cotton-thobe-white", pill: "Thobes", image: "images/categories/summer-thobes" },
  { photo: "images/hero/hero-new", slug: "stitched-saderi-olive", pill: "Saderi", image: "images/categories/saderi" },
  { photo: "images/hero/hero-kids", slug: "tailored-layering-jacket-charcoal", pill: "Jackets", image: "images/categories/kandura-jackets" },
  { photo: "images/pages/about", slug: "occasion-bisht-black", pill: "Bisht", image: "images/categories/bisht" },
];

/** "What We Stand For" cards, same text and photos as /test-mock-2. */
const PROMISES = [
  { image: "images/categories/egal", quote: "Precision in fit, honesty in fabric. Every kandura is finished to the standard our name was built on.", title: "Our promise", note: "Since 1998" },
  { image: "images/categories/ghutra", quote: "Personal attention to every client's needs has earned us a trusted name across the UAE.", title: "Customer first", note: "Our approach" },
  { image: "images/categories/yashmagh", quote: "Our tailors bring the fabrics and the measuring tape straight to your home or majlis.", title: "Home tailoring", note: "We come to you" },
  { image: "images/categories/kufi-caps", quote: "Kanduras cut from the finest fabrics, blending traditional design with modern craft.", title: "Bespoke kanduras", note: "Made to measure" },
  { image: "images/categories/tarboosh", quote: "Visit any of our 13 branches across 5 Emirates to choose fabric and be measured.", title: "13 branches", note: "Across the UAE" },
  { image: "images/categories/arabic-sandals", quote: "Uniforms held to the same exacting standard of precision as our kanduras.", title: "Uniforms", note: "Army & police" },
  { image: "images/categories/kids-footwear", quote: "Arabic sandals and kandura accessories to complete a full traditional look.", title: "Accessories", note: "The finishing touch" },
  { image: "images/categories/kids-headwear", quote: "Order, ask about fabric or book a fitting on WhatsApp, any time.", title: "WhatsApp", note: PHONE_DISPLAY },
];

export default function HomePage() {
  return (
    <>
      <HeroSlider slides={slides} />
      <MostWanted />
      <FindYourFit />
      <FeaturedLooks
        looks={LOOKS.flatMap((l): Look[] => {
          const p = getProduct(l.slug);
          return p ? [{ ...l, photo: imageSrc(l.photo), image: imageSrc(l.image), name: p.name, price: p.price }] : [];
        })}
      />
      <NewArrivals
        items={home.newArrivals.flatMap((slug) => {
          const p = getProduct(slug);
          return p ? [{ slug, name: p.name, price: p.price, colour: p.colour, category: p.category, image: productImage(slug) }] : [];
        })}
      />
      <WhatWeStandFor items={PROMISES.map((p) => ({ ...p, image: imageSrc(p.image) }))} />
      <BehindTheCraft />
      <MadeToMeasure image={imageSrc("images/pages/branches")} />
      <Stats />
      <Marquee />
      <section>
        <div className="wrap">
          <div className="head">
            <h2>Shop by category</h2>
            <Link href="/category/kandura-thobes">View all</Link>
          </div>
          <div className="mosaic">
            {tiles.map((t) => {
              const count = getCategory(t.slug)?.products.length ?? 0;
              return (
                <Link className="tile" key={t.slug} href={`/category/${t.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc(`images/categories/${t.slug}`)} alt="" loading="lazy" />
                  <span className="tile-caption">
                    <small>{count} {count === 1 ? "style" : "styles"}</small>
                    <b>{t.label}</b>
                    <span className="tile-cta">
                      Shop now <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </Link>
              );
            })}
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
    </>
  );
}
