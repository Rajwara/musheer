import type { Metadata } from "next";
import CartView from "@/components/CartView";
import FieldwornShell from "@/components/FieldwornShell";
import PhotoHero from "@/components/search/PhotoHero";
import { allCards } from "@/lib/catalog";
import { imageSrc } from "@/lib/images";
import "../shop-brand.css";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <FieldwornShell className="shop-fw">
      <PhotoHero label="Your bag" title="Your cart" text="Review your pieces, then check out or send your order to us on WhatsApp." image={imageSrc("images/hero/hero-new")} position="50% 40%" />
      <div className="wrap">
        <CartView products={allCards()} />
      </div>
    </FieldwornShell>
  );
}
