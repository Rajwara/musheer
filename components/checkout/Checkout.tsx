"use client";

import Link from "next/link";
import { useState } from "react";
import BtnContent from "@/components/ui/BtnContent";
import { HOME_VISIT_URL, whatsapp } from "@/lib/brand";
import { money } from "@/lib/format";
import type { CardProduct } from "@/lib/types";
import { useStore } from "../StoreProvider";
import "./checkout.css";

export type PickupBranch = { id: string; name: string; area: string; emirate: string };

const EMIRATES = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];

type Delivery = "home" | "branch";
type Fit = "standard" | "saved" | "visit" | "branch";
type Pay = "cod" | "card" | "later";

const FITS: { id: Fit; title: string; text: string }[] = [
  { id: "standard", title: "Use the size I chose", text: "Made to the standard size and length you selected." },
  { id: "saved", title: "Use my saved measurements", text: "For returning customers; we'll match them to your mobile number." },
  { id: "visit", title: "Book a home visit", text: "A tailor measures you at home or in your majlis before we cut." },
  { id: "branch", title: "I'll visit a branch", text: "Get measured at any of our 13 branches." },
];

/** Section heading with a step number. */
const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <section className="co-step">
    <h2>
      <span>{String(n).padStart(2, "0")}</span>
      {title}
    </h2>
    {children}
  </section>
);

/**
 * Checkout in the /test-mock-2 branding. Online payment is not connected yet,
 * so placing the order sends the full order to the team on WhatsApp.
 */
export default function Checkout({ products, branches, tailoredCats }: { products: CardProduct[]; branches: PickupBranch[]; tailoredCats: string[] }) {
  const { cart } = useStore();
  const [delivery, setDelivery] = useState<Delivery>("home");
  const [fit, setFit] = useState<Fit>("standard");
  const [pay, setPay] = useState<Pay>("cod");
  const [placed, setPlaced] = useState<string | null>(null);

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const lines = cart.map((l) => ({ l, p: bySlug.get(l.slug)! })).filter((x) => x.p);
  const count = lines.reduce((a, { l }) => a + l.qty, 0);
  const subtotal = lines.reduce((a, { l, p }) => a + p.price * l.qty, 0);
  const tailored = lines.some(({ p }) => tailoredCats.includes(p.categorySlug));
  const emirates = [...new Set(branches.map((b) => b.emirate))];

  if (!lines.length && !placed) {
    return (
      <div className="co-empty">
        <h2>Your cart is empty</h2>
        <p>Add a piece or two, then come back to check out.</p>
        <Link className="am-btn" href="/shop">
          <BtnContent label="Shop all categories" />
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="co-done">
        <span className="co-done-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30">
            <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="co-label">*Order sent</span>
        <h2>Thank you, {placed}</h2>
        <p>Your order has opened in WhatsApp. Press send there and our team will confirm the details, delivery and payment with you.</p>
        <div className="co-done-btns">
          <Link className="am-btn" href="/shop">
            <BtnContent label="Continue shopping" />
          </Link>
          <Link className="am-btn am-line" href="/cart">
            <BtnContent label="Back to cart" />
          </Link>
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const branch = branches.find((b) => b.id === v("branch"));
    const msg = [
      "Hello Al Musheer, I would like to place this order:",
      "",
      ...lines.map(({ l, p }) => `- ${p.name}${l.options ? ` (${l.options})` : ""} x${l.qty}: ${money(p.price * l.qty)}`),
      `Subtotal: ${money(subtotal)}`,
      "",
      `Name: ${v("name")}`,
      `Mobile: ${v("phone")}`,
      v("email") ? `Email: ${v("email")}` : false,
      "",
      delivery === "home"
        ? `Delivery to: ${[v("address"), v("apartment"), v("area"), v("emirate")].filter(Boolean).join(", ")}${v("makani") ? ` (Makani ${v("makani")})` : ""}`
        : `Collect from branch: ${branch ? `${branch.name}, ${branch.area}, ${branch.emirate}` : v("branch")}`,
      v("notes") ? `Notes: ${v("notes")}` : false,
      tailored ? `Measurements: ${FITS.find((x) => x.id === fit)?.title}` : false,
      `Payment: ${delivery === "branch" ? "Pay at the branch" : "Cash on delivery"}`,
    ]
      .filter((x) => x !== false)
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
    window.open(whatsapp(msg), "_blank", "noopener");
    setPlaced(v("name").split(" ")[0] || "for your order");
    window.scrollTo({ top: 0 });
  };

  return (
    <form className="co" onSubmit={submit}>
      <div className="co-main">
        <Step n={1} title="Contact">
          <div className="co-grid">
            <label className="co-field co-wide">
              <span>Full name</span>
              <input name="name" autoComplete="name" required />
            </label>
            <label className="co-field">
              <span>Mobile number</span>
              <input name="phone" type="tel" autoComplete="tel" defaultValue="+971 " required pattern="[+0-9 ()-]{9,}" title="Please enter your mobile number, e.g. +971 50 123 4567" />
            </label>
            <label className="co-field">
              <span>
                Email <small>(optional)</small>
              </span>
              <input name="email" type="email" autoComplete="email" />
            </label>
          </div>
        </Step>

        <Step n={2} title="Delivery">
          <div className="co-choices co-two">
            {[
              ["home", "Home delivery", "Across the UAE. The delivery charge is confirmed before your order is final."],
              ["branch", "Collect from a branch", "Free. Pick up from any of our 13 branches."],
            ].map(([id, title, text]) => (
              <label key={id} className={delivery === id ? "co-choice on" : "co-choice"}>
                <input type="radio" name="delivery" value={id} checked={delivery === id} onChange={() => setDelivery(id as Delivery)} />
                <b>{title}</b>
                <small>{text}</small>
              </label>
            ))}
          </div>

          {delivery === "home" ? (
            <div className="co-grid">
              <label className="co-field">
                <span>Emirate</span>
                <select name="emirate" required defaultValue="">
                  <option value="" disabled>
                    Choose emirate
                  </option>
                  {EMIRATES.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </label>
              <label className="co-field">
                <span>Area</span>
                <input name="area" autoComplete="address-level2" placeholder="e.g. Al Barsha" required />
              </label>
              <label className="co-field co-wide">
                <span>Street, building or villa</span>
                <input name="address" autoComplete="address-line1" required />
              </label>
              <label className="co-field">
                <span>
                  Apartment / floor <small>(optional)</small>
                </span>
                <input name="apartment" autoComplete="address-line2" />
              </label>
              <label className="co-field">
                <span>
                  Makani number <small>(optional)</small>
                </span>
                <input name="makani" inputMode="numeric" />
              </label>
              <label className="co-field co-wide">
                <span>
                  Delivery notes <small>(optional)</small>
                </span>
                <textarea name="notes" rows={3} placeholder="Landmark, best time to deliver…" />
              </label>
            </div>
          ) : (
            <div className="co-grid">
              <label className="co-field co-wide">
                <span>Branch</span>
                <select name="branch" required defaultValue="">
                  <option value="" disabled>
                    Choose a branch
                  </option>
                  {emirates.map((em) => (
                    <optgroup key={em} label={em}>
                      {branches
                        .filter((b) => b.emirate === em)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} · {b.area}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              <p className="co-hint co-wide">
                Not sure which is closest? <Link href="/contact#branches">Find your nearest branch</Link>.
              </p>
            </div>
          )}
        </Step>

        {tailored && (
          <Step n={3} title="Measurements">
            <p className="co-hint">Your order includes tailored kanduras. How should we size them?</p>
            <div className="co-choices co-two">
              {FITS.map((x) => (
                <label key={x.id} className={fit === x.id ? "co-choice on" : "co-choice"}>
                  <input type="radio" name="fit" value={x.id} checked={fit === x.id} onChange={() => setFit(x.id)} />
                  <b>{x.title}</b>
                  <small>{x.text}</small>
                </label>
              ))}
            </div>
            {fit === "visit" && (
              <p className="co-hint">
                We&apos;ll arrange the visit when we confirm your order, or{" "}
                <a href={HOME_VISIT_URL} target="_blank" rel="noopener noreferrer">
                  book it on WhatsApp now
                </a>
                .
              </p>
            )}
          </Step>
        )}

        <Step n={tailored ? 4 : 3} title="Payment">
          <div className="co-choices">
            <label className={pay === "cod" ? "co-choice on" : "co-choice"}>
              <input type="radio" name="pay" value="cod" checked={pay === "cod"} onChange={() => setPay("cod")} />
              <b>{delivery === "branch" ? "Pay at the branch" : "Cash on delivery"}</b>
              <small>{delivery === "branch" ? "Pay by card or cash when you collect." : "Pay the courier when your order arrives. Card on delivery may be available on request."}</small>
            </label>
            <label className="co-choice off">
              <input type="radio" name="pay" value="card" disabled />
              <b>
                Card, Apple Pay or Google Pay <em>Coming soon</em>
              </b>
              <small>Secure online payment is being set up.</small>
            </label>
            <label className="co-choice off">
              <input type="radio" name="pay" value="later" disabled />
              <b>
                Pay later in instalments <em>Coming soon</em>
              </b>
              <small>Split your payment into smaller amounts.</small>
            </label>
          </div>
        </Step>
      </div>

      <aside className="co-sum" aria-label="Order summary">
        <div className="co-sum-head">
          <h2>Your order</h2>
          <Link href="/cart">Edit cart</Link>
        </div>
        <ul className="co-items">
          {lines.map(({ l, p }) => (
            <li key={`${l.slug}|${l.options}`}>
              <span className="co-pic">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" />
                <b>{l.qty}</b>
              </span>
              <span className="co-item">
                <b>{p.name}</b>
                {l.options && <small>{l.options}</small>}
              </span>
              <span className="co-price">{money(p.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="co-row">
          <span>Subtotal ({count})</span>
          <b>{money(subtotal)}</b>
        </div>
        <div className="co-row">
          <span>Delivery</span>
          <span>{delivery === "branch" ? "Free" : "Confirmed with your order"}</span>
        </div>
        <div className="co-row co-total">
          <span>Total</span>
          <b>{money(subtotal)}</b>
        </div>
        <p className="co-vat">Prices include VAT where it applies.</p>
        <button className="am-btn co-place" type="submit">
          <BtnContent label="Place order on WhatsApp" icon="whatsapp" />
        </button>
        <p className="co-fine">
          Placing your order opens WhatsApp with everything filled in; our team confirms delivery and payment with you there. See our <Link href="/policies/shipping">shipping</Link> and{" "}
          <Link href="/policies/refund">returns</Link> policies.
        </p>
        <ul className="co-trust">
          <li>Free fit adjustments within 14 days</li>
          <li>Returns on ready-made items within 7 days</li>
          <li>Questions? WhatsApp us any time</li>
        </ul>
      </aside>
    </form>
  );
}
