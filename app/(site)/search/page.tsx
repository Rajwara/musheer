import type { Metadata } from "next";
import Link from "next/link";
import FieldwornShell from "@/components/FieldwornShell";
import ShopAll, { type ShopGroup, type ShopProduct } from "@/components/shop/ShopAll";
import BtnContent from "@/components/ui/BtnContent";
import { categories, getCategory, home, products, toCard } from "@/lib/catalog";
import { imageSrc } from "@/lib/images";
import "../shop-brand.css";
import "@/components/search/search.css";

export const metadata: Metadata = { title: "Search" };

const POPULAR = ["Kandura", "Thobe", "Bisht", "Ghutra", "Sandals", "Perfume", "Kids"];
const ORDER = ["Kandura and Thobe", "Outerwear", "Casual and underwear", "Headwear", "Footwear", "Kids", "Accessories", "Gifts"];

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SearchPage({ searchParams }: Props) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").trim();
  const needle = q.toLowerCase();

  const isNew = new Set(home.newArrivals);
  const list: ShopProduct[] = products.map((p) => ({ ...toCard(p), group: getCategory(p.categorySlug)?.group ?? "Other", isNew: isNew.has(p.slug) }));
  const hits = needle ? list.filter((p) => `${p.name} ${p.category} ${p.colour} ${p.group}`.toLowerCase().includes(needle)).length : list.length;

  const names = [...new Set(categories.map((c) => c.group))].sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));
  const groups: ShopGroup[] = names.map((name) => ({
    name,
    categories: categories.filter((c) => c.group === name).map((c) => ({ slug: c.slug, title: c.title, count: c.products.length, image: imageSrc(`images/categories/${c.slug}`) })),
  }));

  return (
    <FieldwornShell className="shop-fw">
      <section className="srch" aria-labelledby="srch-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="srch-bg" src={imageSrc("images/hero/hero-adult")} alt="" />
        <div className="srch-in">
          <span className="srch-label">*Search</span>
          <h1 id="srch-title">{q ? `“${q}”` : "Find your piece"}</h1>
          <p className="srch-count">
            {q
              ? hits
                ? `${hits} ${hits === 1 ? "product matches" : "products match"} your search. Narrow it down with the filters below.`
                : "Nothing matches that search yet. Try another word, or browse the popular searches."
              : "Search kanduras, thobes, headwear, sandals, perfumes and more."}
          </p>
          <form className="srch-form" action="/search" role="search">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input name="q" type="search" defaultValue={q} placeholder="I'm looking for…" aria-label="Search products" />
            <button className="am-btn am-sm" type="submit">
              <BtnContent label="Search" icon="search" />
            </button>
          </form>
          <div className="srch-popular">
            <small>Popular</small>
            {POPULAR.map((t) => (
              <Link key={t} href={`/search?q=${encodeURIComponent(t.toLowerCase())}`} className={needle === t.toLowerCase() ? "on" : undefined}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="wrap">
        <ShopAll key={q} products={list} groups={groups} strip={false} initialQuery={q} />
      </div>
    </FieldwornShell>
  );
}
