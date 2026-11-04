import MarketsBehavior from "@/app/(site)/test-mock/MarketsBehavior";
import globe from "@/lib/data/uae-globe.json";
import "@/app/(site)/test-mock/markets.css";

export type EmirateCard = {
  emirate: string;
  slug: string;
  count: number;
  areas: string[];
  photo: string;
};

const pinIcon = (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <circle cx="8" cy="5.5" r="3" />
    <path d="M8 8.5V15" />
  </svg>
);
const arrowIcon = (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
);

/**
 * The /test-mock "Where we operate" markets section, filled with Al Musheer's
 * branches: a globe centred on the UAE (scripts/generate-uae-globe.mjs), a
 * marker per emirate, a dot per branch, and a card per emirate that jumps to
 * that emirate in the branch finder below.
 */
export default function BranchMarkets({ cards, total }: { cards: EmirateCard[]; total: number }) {
  return (
    <section className="mk" aria-labelledby="mk-title">
      <div className="mk__head">
        <h2 className="mk__title" id="mk-title">
          Where we tailor: {total} branches across {cards.length} Emirates.
        </h2>
        <a className="mk__btn" href="#branches">
          Find your nearest branch
        </a>
      </div>

      <div className="mk__stage">
        <div className="mk__globe" aria-hidden="true">
          <div className="mk__globe-inner" style={{ position: "absolute", inset: 0 }}>
            <svg viewBox="0 0 1000 1000" role="presentation">
              <defs>
                <radialGradient id="mk-ocean" cx="50%" cy="38%" r="62%">
                  <stop offset="0" stopColor="#dcdcdc" />
                  <stop offset=".72" stopColor="#d1d1d1" />
                  <stop offset="1" stopColor="#bdbdbd" />
                </radialGradient>
                <radialGradient id="mk-shade" cx="50%" cy="45%" r="55%">
                  <stop offset=".72" stopColor="#3c3c3c" stopOpacity="0" />
                  <stop offset="1" stopColor="#3c3c3c" stopOpacity=".2" />
                </radialGradient>
                <filter id="mk-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="20" />
                </filter>
                <clipPath id="mk-clip">
                  <circle cx="500" cy="500" r="490" />
                </clipPath>
              </defs>
              <circle cx="500" cy="500" r="493" fill="#5e5e5e" opacity=".42" filter="url(#mk-glow)" />
              <circle cx="500" cy="500" r="490" fill="url(#mk-ocean)" />
              <g clipPath="url(#mk-clip)">
                <path d={globe.graticule} fill="none" stroke="#8f8f8f" strokeOpacity=".35" strokeWidth=".8" />
                <path d={globe.land} fill="#e9e9e9" stroke="#f7f7f7" strokeWidth=".6" />
                <path d={globe.borders} fill="none" stroke="#ffffff" strokeWidth=".8" />
                <path d={globe.uae} fill="#fcfcfc" stroke="#ffffff" strokeWidth=".8" />
              </g>
              <circle cx="500" cy="500" r="490" fill="url(#mk-shade)" />
              <circle cx="500" cy="500" r="490" fill="none" stroke="#6f6f6f" strokeWidth="1.6" />
            </svg>
            {globe.dots.map((d, i) => (
              <i key={i} className="mk-dot" style={{ left: `${d.left}%`, top: `${d.top}%` }} />
            ))}
            {cards.map((c, i) => {
              const m = globe.markers.find((x) => x.emirate === c.emirate)!;
              return (
                <span
                  key={c.slug}
                  className="mk-marker"
                  data-i={i}
                  style={{ left: `${m.left}%`, top: `${m.top}%`, "--delay": `${-i * 1.8}s` } as React.CSSProperties}
                >
                  <i className="mk-marker__ring" />
                  <i className="mk-marker__sweep" />
                  <i className="mk-marker__core" />
                  <b className="mk-marker__label">{c.emirate}</b>
                </span>
              );
            })}
          </div>
        </div>

        <div className="mk__cards">
          {cards.map((c, i) => (
            <a
              key={c.slug}
              className="mk-card"
              href={`#find-${c.slug}`}
              data-i={i}
              aria-label={`${c.emirate}: ${c.count} ${c.count === 1 ? "branch" : "branches"}, ${c.areas.join(", ")}`}
            >
              <span className="mk-card__photo" style={{ "--photo": `url("${c.photo}")` } as React.CSSProperties} />
              <span className="mk-card__top">
                <span className="mk-card__num">{String(c.count).padStart(2, "0")}</span>
                <span className="mk-card__label">{c.count === 1 ? "Branch" : "Branches"}</span>
              </span>
              <span className="mk-card__bottom">
                <span>
                  <span className="mk-card__city">{c.emirate}, UAE</span>
                  <span className="mk-card__areas">{c.areas.join(" · ")}</span>
                </span>
                <span className="mk-card__icon">
                  <span className="mk-card__pin">{pinIcon}</span>
                  <span className="mk-card__arrow">{arrowIcon}</span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
      <MarketsBehavior />
    </section>
  );
}
