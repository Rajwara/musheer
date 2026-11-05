import { getCategory, getProduct } from "@/lib/catalog";
import { imageSrc } from "@/lib/images";
import FitGrid, { type FitCard } from "./FitGrid";
import "./find-your-fit.css";

/**
 * Every shop category, grouped for the filter tabs. The first six are the
 * /test-mock-2 cards and show first under "All"; the rest appear with
 * "View all categories" or under their own tab.
 */
const CARDS = [
  { slug: "adult-thobes", group: "kandura" },
  { slug: "traditional-kandura", group: "kandura" },
  { slug: "kids-clothing", group: "kids" },
  { slug: "shimagh-ghutra", group: "headwear" },
  { slug: "perfumes", group: "accessories" },
  { slug: "wallets", group: "accessories" },
  { slug: "summer-thobes", group: "kandura" },
  { slug: "bisht", group: "outerwear" },
  { slug: "kandura-jackets", group: "outerwear" },
  { slug: "saderi", group: "outerwear" },
  { slug: "shawls", group: "outerwear" },
  { slug: "jalabiya", group: "casual" },
  { slug: "arabian-casuals", group: "casual" },
  { slug: "faneela", group: "casual" },
  { slug: "wuzar", group: "casual" },
  { slug: "trunks-salwar", group: "casual" },
  { slug: "ghutra", group: "headwear" },
  { slug: "yashmagh", group: "headwear" },
  { slug: "egal", group: "headwear" },
  { slug: "tarboosh", group: "headwear" },
  { slug: "kufi-caps", group: "headwear" },
  { slug: "arabic-sandals", group: "footwear" },
  { slug: "kids-headwear", group: "kids" },
  { slug: "kids-footwear", group: "kids" },
  { slug: "gift-card", group: "accessories" },
];

/** "*Category / Find Your Fit" from /test-mock-2: filter tabs over every shop category. */
export default function FindYourFit() {
  const cards: FitCard[] = CARDS.flatMap(({ slug, group }) => {
    const c = getCategory(slug);
    if (!c) return [];
    const prices = c.products.flatMap((s) => getProduct(s)?.price ?? []);
    return [{ slug, group, title: c.title, count: c.products.length, from: prices.length ? Math.min(...prices) : 0, image: imageSrc(`images/categories/${slug}`) }];
  });

  return (
    <section className="fyf" aria-labelledby="fyf-title">
      <div className="fyf-container">
        <div className="fyf-head">
          <div>
            <span className="fyf-label">*Shop by Category</span>
            <h2 id="fyf-title">Find Your Fit</h2>
          </div>
          <p>Shop by what you need, from everyday kanduras to kids&apos; wear, headwear and accessories.</p>
        </div>
        <FitGrid cards={cards} />
      </div>
    </section>
  );
}
