import type { Metadata } from "next";
import { share } from "@/lib/og";
import Link from "next/link";
import Checkout from "@/components/checkout/Checkout";
import FieldwornShell from "@/components/FieldwornShell";
import { BRANCHES } from "@/lib/brand";
import { allCards, categories } from "@/lib/catalog";
import "../shop-brand.css";

export const metadata: Metadata = { title: "Checkout", robots: { index: false }, ...share("Checkout", "Al Musheer: kandura tailoring in the UAE since 1998.", "cart") };

export default function CheckoutPage() {
  const branches = BRANCHES.flatMap((e) => e.branches.map((b) => ({ id: b.id, name: b.name, area: b.area, emirate: e.emirate })));
  // Kanduras and thobes (adult and kids) are tailored, so checkout asks how to measure them.
  const tailoredCats = categories.filter((c) => c.group === "Kandura and Thobe" || c.slug === "kids-clothing").map((c) => c.slug);

  return (
    <FieldwornShell className="shop-fw">
      <div className="co-head">
        <div>
          <div className="crumb">
            <Link href="/cart">Cart</Link> / Checkout
          </div>
          <span className="co-label">*Almost yours</span>
          <h1>Checkout</h1>
        </div>
        <ol className="co-steps" aria-label="Steps">
          <li>
            <b>01</b> Cart
          </li>
          <li className="on">
            <b>02</b> Details
          </li>
          <li>
            <b>03</b> Confirmation
          </li>
        </ol>
      </div>
      <div className="wrap">
        <Checkout products={allCards()} branches={branches} tailoredCats={tailoredCats} />
      </div>
    </FieldwornShell>
  );
}
