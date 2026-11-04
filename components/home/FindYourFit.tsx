import { getCategory, getProduct } from "@/lib/catalog";
import { imageSrc } from "@/lib/images";
import FitGrid, { type FitCard } from "./FitGrid";
import "./find-your-fit.css";

/** Same six categories, filters and photos as the /test-mock-2 section. */
const CARDS = [
  { slug: "adult-thobes", group: "kandura" },
  { slug: "traditional-kandura", group: "kandura" },
  { slug: "kids-clothing", group: "kids" },
  { slug: "shimagh-ghutra", group: "headwear" },
  { slug: "perfumes", group: "accessories" },
  { slug: "wallets", group: "accessories" },
];

/** "*Category / Find Your Fit" from /test-mock-2: filter tabs over category cards. */
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
            <span className="fyf-label">*Category</span>
            <h2 id="fyf-title">Find Your Fit</h2>
          </div>
          <p>Shop by what you need, from everyday kanduras to kids&apos; wear, headwear and accessories.</p>
        </div>
        <FitGrid cards={cards} />
      </div>
    </section>
  );
}
