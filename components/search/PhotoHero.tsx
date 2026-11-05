import "./search.css";

/**
 * Photo banner in the home page layout (rounded panel, huge uppercase title,
 * line of text and actions). Used on Search, Cart and Saved.
 */
export default function PhotoHero({ label, title, text, image, position, children }: { label: string; title: string; text: React.ReactNode; image: string; position?: string; children?: React.ReactNode }) {
  return (
    <section className="srch" aria-labelledby="ph-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="srch-bg" src={image} alt="" style={position ? { objectPosition: position } : undefined} />
      <div className="srch-in">
        <span className="srch-label">*{label}</span>
        <h1 id="ph-title">{title}</h1>
        <p className="srch-count">{text}</p>
        {children}
      </div>
    </section>
  );
}
