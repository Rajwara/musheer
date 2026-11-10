import type { Metadata } from "next";
import { share } from "@/lib/og";
import { money } from "@/lib/format";
import FieldwornShell from "@/components/FieldwornShell";
import "../../shop-brand.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import { cards, getProduct, products } from "@/lib/catalog";
import { productImage } from "@/lib/images";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const description = p.metaDescription || `${p.name} at Al Musheer.`;
  return { title: p.name, description, ...share(`${p.name} · ${money(p.price)}`, description, `product-${p.slug}`) };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();

  const images = (["front", "side", "back"] as const).map((view) => ({ view, src: productImage(p.slug, view) }));
  const related = cards(p.related);

  return (
    <FieldwornShell className="shop-fw">
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Home</Link> / <Link href={`/category/${p.categorySlug}`}>{p.category}</Link> / {p.name}
      </div>
      <ProductDetail
        slug={p.slug}
        name={p.name}
        price={p.price}
        description={p.description}
        options={p.options}
        sizeGuide={p.sizeGuide}
        images={images}
      >
        {related.length > 0 && (
          <section style={{ paddingTop: 20 }}>
            <div className="head">
              <div>
                <span className="shop-label">*Complete the look</span>
                <h2>You may also like</h2>
              </div>
              <Link href={`/category/${p.categorySlug}`}>View all</Link>
            </div>
            <ProductGrid products={related} />
          </section>
        )}
      </ProductDetail>
    </div>
    </FieldwornShell>
  );
}
