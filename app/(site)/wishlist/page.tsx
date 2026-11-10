import type { Metadata } from "next";
import { share } from "@/lib/og";
import FieldwornShell from "@/components/FieldwornShell";
import PhotoHero from "@/components/search/PhotoHero";
import WishlistView from "@/components/WishlistView";
import { allCards } from "@/lib/catalog";
import { imageSrc } from "@/lib/images";
import "../shop-brand.css";

export const metadata: Metadata = { title: "Saved products", ...share("Saved products", "Al Musheer: kandura tailoring in the UAE since 1998.", "cart") };

export default function WishlistPage() {
  return (
    <FieldwornShell className="shop-fw">
      <PhotoHero label="Saved" title="Saved pieces" text="Everything you've hearted, in one place. Open quick view to choose a size and add to your cart." image={imageSrc("images/pages/about")} position="50% 30%" />
      <div className="wrap">
        <WishlistView products={allCards()} />
      </div>
    </FieldwornShell>
  );
}
