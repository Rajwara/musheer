"use client";

import { useMemo, useState } from "react";
import type { CardProduct } from "@/lib/types";
import { ProductGrid } from "./ProductCard";

type Sort = "featured" | "low" | "high";

/** Colour filter, sort control and product grid for a category page. */
export default function CategoryShop({ products, sidebar }: { products: CardProduct[]; sidebar: React.ReactNode }) {
  const [sort, setSort] = useState<Sort>("featured");
  const [picked, setPicked] = useState<string[]>([]);

  const colours = useMemo(() => [...new Set(products.map((p) => p.colour))].sort(), [products]);

  const shown = useMemo(() => {
    const list = products.filter((p) => !picked.length || picked.includes(p.colour));
    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, picked, sort]);

  const toggle = (c: string) => setPicked((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <div className="shop">
      <aside className="side">
        {sidebar}
        <div>
          <h4>Colour</h4>
          <div className="swatches">
            {colours.map((c) => (
              <label key={c}>
                <input type="checkbox" value={c} checked={picked.includes(c)} onChange={() => toggle(c)} /> {c}
              </label>
            ))}
          </div>
        </div>
      </aside>
      <div>
        <div className="bar">
          <span>
            {shown.length} {shown.length === 1 ? "product" : "products"}
          </span>
          <label>
            Sort{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
        <ProductGrid products={shown} cols={3} />
      </div>
    </div>
  );
}
