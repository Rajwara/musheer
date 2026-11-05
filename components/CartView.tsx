"use client";

import BtnContent from "@/components/ui/BtnContent";
import Link from "next/link";
import { useState } from "react";
import { whatsapp } from "@/lib/brand";
import { money } from "@/lib/format";
import type { CardProduct } from "@/lib/types";
import { useStore } from "./StoreProvider";
import "./cart/cart.css";

/** Cart lines, order summary and empty state, in the /test-mock-2 branding. */
export default function CartView({ products }: { products: CardProduct[] }) {
  const { cart, changeQty, removeLine } = useStore();
  const [checkout, setCheckout] = useState(false);
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const lines = cart.map((line, index) => ({ line, index, p: bySlug.get(line.slug)! })).filter((l) => l.p);

  if (!lines.length) {
    return (
      <div className="ct">
        <div className="ct-empty">
          <span className="ct-empty-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 8h14l1.5 13h-17zM8.5 8V6a3.5 3.5 0 0 1 7 0v2" />
            </svg>
          </span>
          <h2>Your cart is empty</h2>
          <p>Find your next kandura, or pick up where you left off with your saved pieces.</p>
          <div className="ct-empty-btns">
            <Link className="am-btn" href="/shop">
              <BtnContent label="Shop all categories" />
            </Link>
            <Link className="am-btn am-line" href="/wishlist">
              <BtnContent label="View saved pieces" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const count = lines.reduce((a, { line }) => a + line.qty, 0);
  const total = lines.reduce((a, { line, p }) => a + p.price * line.qty, 0);
  const message = `Hello Al Musheer, I would like to order:\n${lines.map(({ line, p }) => `- ${p.name}${line.options ? ` (${line.options})` : ""} x${line.qty}`).join("\n")}\nSubtotal: ${money(total)}`;

  return (
    <div className="ct">
      <div>
        <div className="ct-head">
          <span>
            <b>
              {count} {count === 1 ? "item" : "items"}
            </b>{" "}
            in your cart
          </span>
          <Link href="/shop">Continue shopping</Link>
        </div>
        {lines.map(({ line, index, p }) => (
          <div className="ct-line" key={`${line.slug}|${line.options}`}>
            <Link className="ct-pic" href={`/product/${p.slug}`} aria-label={p.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src={p.image} />
            </Link>
            <div>
              <span className="ct-cat">{p.category}</span>
              <Link className="ct-name" href={`/product/${p.slug}`}>
                {p.name}
              </Link>
              {line.options && (
                <div className="ct-opts">
                  {line.options.split(" / ").map((o) => (
                    <span key={o}>{o}</span>
                  ))}
                </div>
              )}
              <div className="ct-actions">
                <div className="ct-qty">
                  <button type="button" aria-label="Decrease quantity" onClick={() => changeQty(index, -1)}>
                    −
                  </button>
                  <output aria-label="Quantity">{line.qty}</output>
                  <button type="button" aria-label="Increase quantity" onClick={() => changeQty(index, 1)}>
                    +
                  </button>
                </div>
                <button className="ct-remove" type="button" onClick={() => removeLine(index)}>
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
            <div className="ct-price">
              <b>{money(p.price * line.qty)}</b>
              {line.qty > 1 && <small>{money(p.price)} each</small>}
            </div>
          </div>
        ))}
      </div>

      <aside className="ct-sum" aria-label="Order summary">
        <h2>Order summary</h2>
        <div className="ct-row">
          <span>Subtotal ({count})</span>
          <b>{money(total)}</b>
        </div>
        <div className="ct-row">
          <span>Delivery</span>
          <span>Confirmed with your order</span>
        </div>
        <div className="ct-row ct-total">
          <span>Total</span>
          <b>{money(total)}</b>
        </div>
        <div className="ct-btns">
          <button className="am-btn" type="button" onClick={() => setCheckout(true)}>
            <BtnContent label="Checkout" />
          </button>
          <a className="am-btn am-line" href={whatsapp(message)} target="_blank" rel="noopener noreferrer">
            <BtnContent label="Order on WhatsApp" icon="whatsapp" />
          </a>
        </div>
        {checkout && <p className="ct-note">Checkout is not active yet. Connect a payment provider before launch. For now, order on WhatsApp.</p>}
        <ul className="ct-trust">
          <li>Free fit adjustments within 14 days</li>
          <li>Returns on ready-made items within 7 days</li>
          <li>Try on and get measured at 13 branches</li>
        </ul>
      </aside>
    </div>
  );
}
