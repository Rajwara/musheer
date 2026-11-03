import type { Metadata } from "next";
import CartView from "@/components/CartView";
import TextPage from "@/components/TextPage";
import { allCards } from "@/lib/catalog";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <TextPage title="Your cart">
      <CartView products={allCards()} />
    </TextPage>
  );
}
