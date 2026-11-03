import Link from "next/link";
import { money } from "@/lib/format";
import type { CardProduct } from "@/lib/types";
import HeartButton from "./HeartButton";

export default function ProductCard({ product: p }: { product: CardProduct }) {
  const href = `/product/${p.slug}`;
  return (
    <article className="card" data-color={p.colour} data-price={p.price}>
      <Link className="pic" href={href}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.name} loading="lazy" />
      </Link>
      <HeartButton slug={p.slug} name={p.name} />
      <h3>
        <Link href={href}>{p.name}</Link>
      </h3>
      <div className="row">
        <span>{p.colour}</span>
        <span className="price">{money(p.price)}</span>
      </div>
    </article>
  );
}

export function ProductGrid({ products, cols }: { products: CardProduct[]; cols?: number }) {
  return (
    <div className="grid" style={cols ? ({ "--cols": cols } as React.CSSProperties) : undefined}>
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
