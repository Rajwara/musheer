const WORDS = [
  "Bespoke kanduras",
  "Since 1998",
  "Home tailoring",
  "13 branches across the UAE",
  "Finest fabrics",
  "Precision in fit",
  "Order on WhatsApp",
];

/** Slow, endless strip of brand values. Pauses on hover; static for reduced motion. */
export default function Marquee() {
  const row = (hidden: boolean) => (
    <div className="marquee-row" aria-hidden={hidden || undefined}>
      {WORDS.map((w) => (
        <span key={w}>
          {w}
          <i aria-hidden="true">✦</i>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
