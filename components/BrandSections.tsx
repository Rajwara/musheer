import BtnContent from "@/components/ui/BtnContent";
import Link from "next/link";
import {
  HOME_VISIT,
  HOME_VISIT_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  SERVICES,
  STATS,
  STORY,
  WHO_WE_ARE,
} from "@/lib/brand";
import { imageSrc } from "@/lib/images";
import Icon from "./Icon";

export function SectionHead({ eyebrow, title, light }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className={light ? "center-head light" : "center-head"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <span className="rule" aria-hidden="true" />
    </div>
  );
}

export function Stats() {
  return (
    <div className="stats">
      <div className="wrap">
        {STATS.map((s) => (
          <div key={s.label}>
            <b>{s.value}</b>
            <small>{s.label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhoWeAre({ image = "images/content/story" }: { image?: string }) {
  return (
    <section style={{ background: "var(--tint)" }}>
      <div className="wrap story">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc(image)} alt="A tailor's table with fabric, measuring tape and scissors" loading="lazy" />
        <div>
          <span className="eyebrow">{WHO_WE_ARE.eyebrow}</span>
          <h2 style={{ margin: "12px 0 16px" }}>{WHO_WE_ARE.title}</h2>
          {WHO_WE_ARE.paragraphs.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <blockquote className="quote">{WHO_WE_ARE.quote}</blockquote>
        </div>
      </div>
    </section>
  );
}

export function Story() {
  return (
    <section className="dark">
      <div className="wrap">
        <SectionHead eyebrow={STORY.eyebrow} title={STORY.title} light />
        <ol className="timeline">
          {STORY.steps.map((s) => (
            <li key={s.title}>
              <span className="when">{s.when}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Services() {
  const numerals = ["I", "II", "III"];
  return (
    <section>
      <div className="wrap">
        <SectionHead eyebrow={SERVICES.eyebrow} title={SERVICES.title} />
        <div className="services">
          {SERVICES.items.map((s, i) => (
            <div className="service" key={s.title}>
              <Link href={s.href} className="service-pic">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc(s.image)} alt={s.title} loading="lazy" />
              </Link>
              <div>
                <span className="numeral">{numerals[i]}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <Link className="more" href={s.href}>
                  {s.href === "/contact" ? "Enquire" : "Shop now"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeVisit() {
  return (
    <section className="dark" id="home-tailoring">
      <div className="wrap">
        <SectionHead eyebrow={HOME_VISIT.eyebrow} title={HOME_VISIT.title} light />
        <p className="lead">{HOME_VISIT.text}</p>
        <ol className="steps">
          {HOME_VISIT.steps.map((s, i) => (
            <li key={s.title}>
              <span className="step-icon">
                <Icon name={s.icon} size={22} />
              </span>
              <span className="when">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <div style={{ textAlign: "center" }}>
          <a className="btn am-btn am-light wa" href={HOME_VISIT_URL} target="_blank" rel="noopener noreferrer">
            <BtnContent label="Book your home visit on WhatsApp" icon="whatsapp" />
          </a>
          <p className="small-note">
            Or call or WhatsApp us directly at <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
