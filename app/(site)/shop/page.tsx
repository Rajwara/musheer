import type { Metadata } from "next";
import Link from "next/link";
import FieldwornShell from "@/components/FieldwornShell";
import ShopAll, { type ShopGroup, type ShopProduct } from "@/components/shop/ShopAll";
import { categories, getCategory, home, products, toCard } from "@/lib/catalog";
import { imageSrc } from "@/lib/images";
import "../shop-brand.css";

export const metadata: Metadata = {
  title: "Shop all categories",
  description: "Every Al Musheer piece in one place: kanduras and thobes, outerwear, headwear, footwear, kids' wear and accessories, with filters for category, price, size and colour.",
};

/** Departments in the order shoppers expect, then any others from the catalogue. */
const ORDER = ["Kandura and Thobe", "Outerwear", "Casual and underwear", "Headwear", "Footwear", "Kids", "Accessories", "Gifts"];

export default function ShopAllPage() {
  const isNew = new Set(home.newArrivals);
  const groupOf = (slug: string) => getCategory(slug)?.group ?? "Other";
  const list: ShopProduct[] = products.map((p) => ({ ...toCard(p), group: groupOf(p.categorySlug), isNew: isNew.has(p.slug) }));

  const names = [...new Set(categories.map((c) => c.group))].sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));
  const groups: ShopGroup[] = names.map((name) => ({
    name,
    categories: categories
      .filter((c) => c.group === name)
      .map((c) => ({ slug: c.slug, title: c.title, count: c.products.length, image: imageSrc(`images/categories/${c.slug}`) })),
  }));

  return (
    <FieldwornShell className="shop-fw">
      <div className="cat-hero sa-hero">
        <div className="cat-hero-copy">
          <div className="crumb">
            <Link href="/">Home</Link> / Shop all
          </div>
          <span className="eyebrow">*All categories</span>
          <h1>Shop All</h1>
          <p>
            {list.length} pieces across {categories.length} categories, from everyday kanduras to headwear, sandals and gifts. Filter by category, price, size or colour.
          </p>
        </div>
        <div className="cat-hero-pic">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc("images/hero/hero-new")} alt="" />
        </div>
      </div>
      <div className="wrap">
        <ShopAll products={list} groups={groups} />
      </div>
    </FieldwornShell>
  );
}
