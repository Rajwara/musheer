import type { Metadata } from "next";
import FieldwornShell from "@/components/FieldwornShell";
import "../../shop-brand.css";
import "@/components/shop/shop-all.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShopAll, { type ShopProduct } from "@/components/shop/ShopAll";
import { cards, categories, getCategory, home } from "@/lib/catalog";
import { imageSrc } from "@/lib/images";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCategory((await params).slug);
  return c ? { title: c.title, description: `Shop ${c.title} at Al Musheer.` } : {};
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).slug);
  if (!category) notFound();

  // Same filters as /shop, limited to this category; filters it can't use are hidden.
  const isNew = new Set(home.newArrivals);
  const list: ShopProduct[] = cards(category.products).map((p) => ({ ...p, group: category.group, isNew: isNew.has(p.slug) }));
  const siblings = category.siblings.flatMap((s) => {
    const sib = getCategory(s);
    return sib ? [{ slug: s, title: sib.title, count: sib.products.length }] : [];
  });

  return (
    <FieldwornShell className="shop-fw">
      <div className="cat-hero">
        <div className="cat-hero-copy">
          <div className="crumb">
            <Link href="/">Home</Link> / {category.group} / {category.title}
          </div>
          <span className="eyebrow">*{category.group}</span>
          <h1>{category.title}</h1>
          <p>
            {category.products.length} {category.products.length === 1 ? "style" : "styles"}, tailored by Al Musheer since 1998.
          </p>
        </div>
        <div className="cat-hero-pic">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc(`images/categories/${category.slug}`)} alt={category.title} />
        </div>
      </div>
      <div className="wrap">
        <ShopAll products={list} groups={[]} scope={{ current: category.slug, group: category.group, siblings }} />
      </div>
    </FieldwornShell>
  );
}
