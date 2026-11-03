import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryShop from "@/components/CategoryShop";
import { cards, categories, getCategory } from "@/lib/catalog";

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

  const sidebar = (
    <div>
      <h4>{category.group}</h4>
      {category.siblings.map((s) => {
        const sib = getCategory(s);
        return sib ? (
          <Link key={s} className={s === category.slug ? "on" : undefined} href={`/category/${s}`}>
            {sib.title}
          </Link>
        ) : null;
      })}
    </div>
  );

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Home</Link> / {category.group} / {category.title}
      </div>
      <div className="page-title">
        <h1>{category.title}</h1>
      </div>
      <CategoryShop products={cards(category.products)} sidebar={sidebar} />
    </div>
  );
}
