"use client";

import BtnContent from "@/components/ui/BtnContent";
import Link from "next/link";
import type { CardProduct } from "@/lib/types";
import { ProductGrid } from "./ProductCard";
import { useStore } from "./StoreProvider";
import "./cart/cart.css";

/** Saved products grid and empty state, in the /test-mock-2 branding. */
export default function WishlistView({ products }: { products: CardProduct[] }) {
  const { wishlist } = useStore();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const items = wishlist.map((s) => bySlug.get(s)).filter((p): p is CardProduct => Boolean(p));

  if (!items.length) {
    return (
      <div className="wl">
        <div className="wl-empty">
          <span className="ct-empty-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />
            </svg>
          </span>
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any product to keep it here for later.</p>
          <div className="ct-empty-btns">
            <Link className="am-btn" href="/shop">
              <BtnContent label="Shop all categories" />
            </Link>
            <Link className="am-btn am-line" href="/shop?filter=new">
              <BtnContent label="See new arrivals" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wl">
      <div className="wl-head">
        <span>
          <b>
            {items.length} saved {items.length === 1 ? "piece" : "pieces"}
          </b>
        </span>
        <Link href="/shop">Keep browsing</Link>
      </div>
      <ProductGrid products={items} />
    </div>
  );
}
