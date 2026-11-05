import { imageSrc } from "@/lib/images";
import "./why-us.css";

const CARDS: { title: string; text: string; icon: React.ReactNode }[] = [
  {
    title: "Worldwide Shipping",
    text: "Delivery across the UAE, and to other countries on request. Rates are confirmed before you pay.",
    icon: (
      <>
        <path d="M3 9h15v12H3z" />
        <path d="M18 13h5l4 4v4h-9" />
        <circle cx="8" cy="22" r="2.5" />
        <circle cx="22" cy="22" r="2.5" />
      </>
    ),
  },
  {
    title: "Free Returns",
    text: "Return unworn ready-made items within 7 days for a full refund, free at any branch.",
    icon: (
      <>
        <rect x="4" y="5" width="22" height="21" rx="4" />
        <path d="M10 15h9a3 3 0 0 1 0 6h-3M13 12l-3 3 3 3" />
      </>
    ),
  },
  {
    title: "Support Online",
    text: "Feel free to connect with us on WhatsApp whenever you need help with an order, fabric or fit.",
    icon: (
      <>
        <path d="M5 7h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H14l-6 5v-5H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
        <path d="M10 15h.01M15 15h.01M20 15h.01" />
      </>
    ),
  },
  {
    title: "Home Tailoring",
    text: "Our tailors bring fabrics and the measuring tape to your home or majlis, then deliver to your door.",
    icon: (
      <>
        <path d="M4 14 15 5l11 9" />
        <path d="M7 12v14h16V12" />
        <path d="M12 26v-7h6v7" />
      </>
    ),
  },
];

/** "*Why Us" section from /test-mock-2: a tall photo beside four numbered service cards. */
export default function WhyUs() {
  return (
    <section className="wu" aria-label="Why Al Musheer">
      <div className="wu-grid">
        <div className="wu-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc("images/categories/kandura-thobes")} alt="" loading="lazy" />
          <span className="wu-label">*Why Us</span>
          <p>Kanduras That Fit Right, Feel Good And Keep Going.</p>
        </div>
        {CARDS.map((c, i) => (
          <article className="wu-card" key={c.title}>
            <div className="wu-top">
              <svg viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {c.icon}
              </svg>
              <b>{String(i + 1).padStart(2, "0")}</b>
            </div>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
