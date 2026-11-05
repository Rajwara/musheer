import HeroSlider, { type Slide } from "@/components/HeroSlider";
import MostWanted from "@/components/home/MostWanted";
import WhyUs from "@/components/home/WhyUs";
import FindYourFit from "@/components/home/FindYourFit";
import FeaturedLooks, { type Look } from "@/components/home/FeaturedLooks";
import NewArrivals from "@/components/home/NewArrivals";
import WhatWeStandFor from "@/components/home/WhatWeStandFor";
import BehindTheCraft from "@/components/home/BehindTheCraft";
import MadeToMeasure from "@/components/home/MadeToMeasure";
import { HERO, PHONE_DISPLAY } from "@/lib/brand";
import { getProduct, home, toCard } from "@/lib/catalog";
import { imageSrc, productImage } from "@/lib/images";

const slides: Slide[] = [
  { eyebrow: HERO.eyebrow, title: HERO.title, text: HERO.text, cta: "Shop kanduras", href: "/category/kandura-thobes", image: imageSrc("images/hero/hero-adult") },
  { eyebrow: "Kids clothing", title: "Occasion wear for young gentlemen", cta: "Shop kids clothing", href: "/category/kids-clothing", image: imageSrc("images/hero/hero-kids") },
  { eyebrow: "Outerwear", title: "Warm layers for cooler evenings", cta: "Shop outerwear", href: "/category/kandura-jackets", image: imageSrc("images/hero/hero-winter") },
  { eyebrow: "New arrivals", title: "New season colours", cta: "Shop new arrivals", href: "/category/adult-thobes", image: imageSrc("images/hero/hero-new") },
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
          return p ? [{ ...l, photo: imageSrc(l.photo), image: imageSrc(l.image), name: p.name, price: p.price, card: toCard(p) }] : [];
        })}
      />
      <NewArrivals
        items={home.newArrivals.flatMap((slug) => {
          const p = getProduct(slug);
          return p ? [{ slug, name: p.name, price: p.price, colour: p.colour, category: p.category, image: productImage(slug), card: toCard(p) }] : [];
        })}
      />
      <WhatWeStandFor items={PROMISES.map((p) => ({ ...p, image: imageSrc(p.image) }))} />
      <BehindTheCraft />
      <MadeToMeasure image={imageSrc("images/pages/branches")} />
      <WhyUs />
    </>
  );
}
