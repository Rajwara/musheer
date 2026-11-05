"use client";

import Link from "next/link";
import { useState } from "react";

export type FaqItem = { q: string; a: string; image: string; link?: { label: string; href: string; external?: boolean } };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

/**
 * FAQ in the style of the "Our process" list on /test-mock-3: numbered rows
 * with a dot, the other rows blur while one is hovered, a tilted photo shows
 * beside the list, and clicking a row opens its answer (one at a time).
 */
export default function FaqList({ groups }: { groups: FaqGroup[] }) {
  const [topic, setTopic] = useState(groups[0]?.id ?? "");
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const group = groups.find((g) => g.id === topic) ?? groups[0];
  const shown = hover ?? open;

  const pick = (id: string) => {
    setTopic(id);
    setOpen(null);
    setHover(null);
  };

  return (
    <>
      <div className="faq-tabs" role="tablist" aria-label="FAQ topics">
        {groups.map((g) => (
          <button key={g.id} type="button" role="tab" aria-selected={g.id === topic} className={g.id === topic ? "on" : undefined} onClick={() => pick(g.id)}>
            {g.title}
            <small>{g.items.length}</small>
          </button>
        ))}
      </div>

      <div className="faq-list" role="tabpanel" aria-label={group.title} onMouseLeave={() => setHover(null)}>
        {group.items.map((it, i) => {
          const id = `${group.id}-${i}`;
          const isOpen = open === id;
          return (
            <div key={id} className={isOpen ? "faq-row open" : "faq-row"} onMouseEnter={() => setHover(id)}>
              <button type="button" className="faq-q" aria-expanded={isOpen} aria-controls={`faq-a-${id}`} onClick={() => setOpen(isOpen ? null : id)}>
                <span className="faq-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-dot" aria-hidden="true" />
                <span className="faq-text">{it.q}</span>
                <span className="faq-plus" aria-hidden="true" />
              </button>
              <div className="faq-a" id={`faq-a-${id}`} role="region" hidden={!isOpen}>
                <p>{it.a}</p>
                {it.link &&
                  (it.link.external ? (
                    <a href={it.link.href} target="_blank" rel="noopener noreferrer">
                      {it.link.label} →
                    </a>
                  ) : (
                    <Link href={it.link.href}>{it.link.label} →</Link>
                  ))}
              </div>
            </div>
          );
        })}

        <div className="faq-images" aria-hidden="true">
          {group.items.map((it, i) => (
            <div key={`${group.id}-${i}`} className={shown === `${group.id}-${i}` ? "on" : undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
