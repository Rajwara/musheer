"use client";

import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useState } from "react";
import { SWATCH } from "@/lib/colours";
import { money } from "@/lib/format";
import type { CardProduct } from "@/lib/types";
import { ProductGrid } from "../ProductCard";
import "./shop-all.css";

export type ShopCategory = { slug: string; title: string; count: number; image: string };
export type ShopGroup = { name: string; categories: ShopCategory[] };
export type ShopProduct = CardProduct & { group: string; isNew: boolean };

type Sort = "featured" | "new" | "low" | "high" | "az";

/** Size values, split into the kinds shoppers look for. */
const SIZE_KINDS: { id: string; title: string; label: string; match: (v: string) => boolean }[] = [
  { id: "clothing", title: "Clothing size", label: "Size", match: (v) => /^(XS|S|M|L|XL|XXL|Free Size)$/.test(v) },
  { id: "kids", title: "Kids age", label: "Size", match: (v) => /^\d+Y$/.test(v) },
  { id: "length", title: "Kandura length (in)", label: "Length (in)", match: () => true },
  { id: "shoe", title: "Shoe size (EU)", label: "EU size", match: () => true },
  { id: "volume", title: "Perfume volume", label: "Volume", match: () => true },
];
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const sortSizes = (a: string, b: string) => {
  const ia = SIZE_ORDER.indexOf(a), ib = SIZE_ORDER.indexOf(b);
  if (ia > -1 || ib > -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  return parseFloat(a) - parseFloat(b) || a.localeCompare(b);
};

/** Highlight filters: shown at the top of the filters and in the category strip. */
const FLAGS: { id: string; label: string; short: string; icon: string; test: (p: ShopProduct) => boolean }[] = [
  { id: "new", label: "New arrivals", short: "New In", icon: "✦", test: (p) => p.isNew },
  { id: "best", label: "Best sellers", short: "Best Sellers", icon: "★", test: (p) => p.badge === "Best seller" },
];

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const key = (kind: string, v: string) => `${kind}:${v}`;

function sizesOf(p: CardProduct) {
  const out: string[] = [];
  for (const k of SIZE_KINDS) {
    const o = p.options.find((x) => x.label === k.label);
    o?.values.filter(k.match).forEach((v) => out.push(key(k.id, v)));
  }
  return out;
}

function Section({ title, count, open: start = true, children }: { title: string; count?: number; open?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(start);
  return (
    <div className={open ? "sa-sec open" : "sa-sec"}>
      <button type="button" className="sa-sec-head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>
          {title}
          {count ? <b className="sa-sec-count">{count}</b> : null}
        </span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="sa-sec-body">{children}</div>}
    </div>
  );
}

/**
 * Every product with all filters, organised into sections: category (by
 * department), price, size (by kind), colour and highlights. Filters,
 * sort and search can be combined; active ones show as removable chips.
 */
/** On a category page: that category and its sister categories, shown as links instead of tick-boxes. */
export type ShopScope = { current: string; group: string; siblings: { slug: string; title: string; count: number }[] };

export default function ShopAll({
  products,
  groups,
  scope,
  art = {},
  strip = true,
  initialQuery = "",
}: {
  products: ShopProduct[];
  groups: ShopGroup[];
  scope?: ShopScope;
  art?: Record<"all" | "new" | "best", string | undefined> | Record<string, never>;
  /** Show the row of category circles (on /shop). */
  strip?: boolean;
  /** Start with this search text (the search page passes the ?q= value). */
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [cats, setCats] = useState<string[]>([]);
  const [colours, setColours] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [flags, setFlags] = useState<string[]>([]);
  const floor = useMemo(() => Math.min(...products.map((p) => p.price)), [products]);
  const ceil = useMemo(() => Math.max(...products.map((p) => p.price)), [products]);
  const [min, setMin] = useState(floor);
  const [max, setMax] = useState(ceil);
  const [sort, setSort] = useState<Sort>("featured");
  const [cols, setCols] = useState(3);
  const [drawer, setDrawer] = useState(false);

  // Links like /shop?category=bisht or /shop?q=ghutra open with that filter set.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const c = sp.getAll("category").flatMap((v) => v.split(","));
    if (c.length) setCats(c);
    const q = sp.get("q");
    if (q) setQuery(q);
    const f = sp.getAll("filter").flatMap((v) => v.split(",")).filter((v) => v === "new" || v === "best");
    if (f.length) setFlags(f);
  }, []);

  const titleOf = useMemo(() => Object.fromEntries(groups.flatMap((g) => g.categories.map((c) => [c.slug, c.title]))), [groups]);

  const matches = (p: ShopProduct, skip?: "cat" | "colour" | "size" | "flag" | "price") => {
    const q = query.trim().toLowerCase();
    if (q && !`${p.name} ${p.category} ${p.colour} ${p.group}`.toLowerCase().includes(q)) return false;
    if (skip !== "cat" && cats.length && !cats.includes(p.categorySlug)) return false;
    if (skip !== "colour" && colours.length && !colours.includes(p.colour)) return false;
    if (skip !== "size" && sizes.length && !sizesOf(p).some((s) => sizes.includes(s))) return false;
    if (skip !== "flag" && flags.includes("best") && p.badge !== "Best seller") return false;
    if (skip !== "flag" && flags.includes("new") && !p.isNew) return false;
    if (skip !== "price" && (p.price < min || p.price > max)) return false;
    return true;
  };

  const shown = useMemo(() => {
    const list = products.filter((p) => matches(p));
    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "az") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "new") return [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, query, cats, colours, sizes, flags, min, max, sort]);

  // Counts next to each option reflect the other filters already chosen.
  const countBy = (skip: "cat" | "colour" | "size" | "flag", test: (p: ShopProduct) => boolean) => products.filter((p) => matches(p, skip) && test(p)).length;

  const usedFlags = useMemo(() => FLAGS.filter((f) => products.some(f.test)), [products]);
  const quickRanges = useMemo(
    () =>
      ([
        [0, 249, "Under AED 250"],
        [250, 499, "AED 250 – 499"],
        [500, 999, "AED 500 – 999"],
        [1000, Infinity, "AED 1,000+"],
      ] as [number, number, string][])
        .filter(([a, b]) => products.some((p) => p.price >= a && p.price <= b))
        .map(([a, b, l]): [number, number, string] => [Math.max(a, floor), Math.min(b, ceil), l]),
    [products, floor, ceil],
  );
  const allColours = useMemo(() => [...new Set(products.map((p) => p.colour))].sort(), [products]);
  const sizeGroups = useMemo(
    () =>
      SIZE_KINDS.map((k) => ({ ...k, values: [...new Set(products.flatMap(sizesOf).filter((s) => s.startsWith(k.id + ":")).map((s) => s.slice(k.id.length + 1)))].sort(sortSizes) })).filter((k) => k.values.length > 1),
    [products],
  );

  // Cards move when the list changes: show any already on screen (the page's
  // fade-in only fires on scroll) and let scroll animations re-measure.
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".sa-main .pcard").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.style.visibility = "";
        el.style.opacity = "";
        el.style.transform = "";
      }
    });
    ScrollTrigger.refresh();
  }, [shown, cols]);

  useEffect(() => {
    document.body.classList.toggle("sa-lock", drawer);
    return () => document.body.classList.remove("sa-lock");
  }, [drawer]);

  const priceOn = min > floor || max < ceil;
  const chips: { label: string; off: () => void }[] = [
    ...groups
      .filter((g) => g.categories.length > 1 && g.categories.every((c) => cats.includes(c.slug)))
      .map((g) => ({ label: g.name, off: () => setCats((l) => l.filter((x) => !g.categories.some((c) => c.slug === x))) })),
    ...cats
      .filter((c) => !groups.some((g) => g.categories.length > 1 && g.categories.every((x) => cats.includes(x.slug)) && g.categories.some((x) => x.slug === c)))
      .map((c) => ({ label: titleOf[c] ?? c, off: () => setCats((l) => l.filter((x) => x !== c)) })),
    ...sizes.map((s) => ({ label: s.split(":")[1], off: () => setSizes((l) => l.filter((x) => x !== s)) })),
    ...colours.map((c) => ({ label: c, off: () => setColours((l) => l.filter((x) => x !== c)) })),
    ...flags.map((f) => ({ label: f === "best" ? "Best sellers" : "New arrivals", off: () => setFlags((l) => l.filter((x) => x !== f)) })),
    ...(priceOn ? [{ label: `${money(min)} – ${money(max)}`, off: () => (setMin(floor), setMax(ceil)) }] : []),
    ...(query.trim() ? [{ label: `“${query.trim()}”`, off: () => setQuery("") }] : []),
  ];
  const clear = () => {
    setCats([]);
    setColours([]);
    setSizes([]);
    setFlags([]);
    setMin(floor);
    setMax(ceil);
    setQuery("");
  };

  const groupSlugs = (g: ShopGroup) => g.categories.map((c) => c.slug);
  const toggleGroup = (g: ShopGroup) => {
    const all = groupSlugs(g);
    const on = all.every((s) => cats.includes(s));
    setCats((l) => (on ? l.filter((s) => !all.includes(s)) : [...new Set([...l, ...all])]));
  };

  return (
    <>
      {/* Every category, as quick filters (on /shop only) */}
      {!scope && strip && (
      <div className="sa-cats" role="group" aria-label="Categories">
        <button type="button" className={cats.length || flags.length ? "sa-cat" : "sa-cat on"} onClick={() => (setCats([]), setFlags([]))}>
          <span className="sa-cat-all sa-cat-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {art.all && <img src={art.all} alt="" loading="lazy" />}
            <em>All</em>
          </span>
          <b>All products</b>
          <small>{products.length}</small>
        </button>
        {FLAGS.map((f) => (
          <button key={f.id} type="button" className={flags.includes(f.id) ? "sa-cat on" : "sa-cat"} aria-pressed={flags.includes(f.id)} onClick={() => setFlags((l) => toggle(l, f.id))}>
            <span className="sa-cat-all sa-cat-flag sa-cat-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {art[f.id as "new" | "best"] && <img src={art[f.id as "new" | "best"]} alt="" loading="lazy" />}
              <em>
                <i aria-hidden="true">{f.icon}</i>
                {f.short}
              </em>
            </span>
            <b>{f.label}</b>
            <small>{products.filter(f.test).length}</small>
          </button>
        ))}
        {groups.flatMap((g) =>
          g.categories.map((c) => (
            <button key={c.slug} type="button" className={cats.includes(c.slug) ? "sa-cat on" : "sa-cat"} aria-pressed={cats.includes(c.slug)} onClick={() => setCats((l) => toggle(l, c.slug))}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt="" loading="lazy" />
              <b>{c.title}</b>
              <small>{c.count}</small>
            </button>
          )),
        )}
      </div>
      )}

      <div className={scope ? "sa sa-scoped" : "sa"}>
        <aside className={drawer ? "sa-side open" : "sa-side"} aria-label="Filters">
          <div className="sa-side-head">
            <b>Filters</b>
            {chips.length > 0 && (
              <button type="button" className="sa-clear" onClick={clear}>
                Clear all
              </button>
            )}
            <button type="button" className="sa-close" aria-label="Close filters" onClick={() => setDrawer(false)}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="sa-search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input type="search" placeholder="Search products" aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          {usedFlags.length > 0 && (
          <Section title="New & Best Sellers" count={flags.length}>
            <div className="sa-flags">
              {usedFlags.map((f) => (
                <button key={f.id} type="button" className={flags.includes(f.id) ? "on" : undefined} aria-pressed={flags.includes(f.id)} onClick={() => setFlags((l) => toggle(l, f.id))}>
                  <span className="sa-flag-ico" aria-hidden="true">{f.icon}</span>
                  <span>{f.label}</span>
                  <small>{countBy("flag", f.test)}</small>
                </button>
              ))}
            </div>
          </Section>
          )}

          {scope ? (
            <Section title={scope.group}>
              <div className="sa-links">
                {scope.siblings.map((c) => (
                  <Link key={c.slug} href={`/category/${c.slug}`} className={c.slug === scope.current ? "on" : undefined} aria-current={c.slug === scope.current ? "page" : undefined}>
                    <span>{c.title}</span>
                    <small>{c.count}</small>
                  </Link>
                ))}
                <Link href="/shop" className="sa-links-all">
                  Shop all categories →
                </Link>
              </div>
            </Section>
          ) : (
          <Section title="Category" count={cats.length}>
            {groups.map((g) => {
              const all = groupSlugs(g);
              const on = all.every((s) => cats.includes(s));
              const some = !on && all.some((s) => cats.includes(s));
              return (
                <div className="sa-group" key={g.name}>
                  <label className="sa-check sa-check-group">
                    <input
                      type="checkbox"
                      checked={on}
                      ref={(el) => {
                        if (el) el.indeterminate = some;
                      }}
                      onChange={() => toggleGroup(g)}
                    />
                    <span>{g.name}</span>
                    <small>{countBy("cat", (p) => all.includes(p.categorySlug))}</small>
                  </label>
                  {g.categories.length > 1 &&
                    g.categories.map((c) => (
                      <label className="sa-check sa-check-sub" key={c.slug}>
                        <input type="checkbox" checked={cats.includes(c.slug)} onChange={() => setCats((l) => toggle(l, c.slug))} />
                        <span>{c.title}</span>
                        <small>{countBy("cat", (p) => p.categorySlug === c.slug)}</small>
                      </label>
                    ))}
                </div>
              );
            })}
          </Section>

          )}

          {ceil > floor && (
          <Section title="Price" count={priceOn ? 1 : 0}>
            <div className="sa-price">
              <div className="sa-range" style={{ "--a": `${((min - floor) / (ceil - floor)) * 100}%`, "--b": `${((max - floor) / (ceil - floor)) * 100}%` } as React.CSSProperties}>
                <input type="range" aria-label="Minimum price" min={floor} max={ceil} step={5} value={min} onChange={(e) => setMin(Math.min(Number(e.target.value), max - 5))} />
                <input type="range" aria-label="Maximum price" min={floor} max={ceil} step={5} value={max} onChange={(e) => setMax(Math.max(Number(e.target.value), min + 5))} />
              </div>
              <div className="sa-price-vals">
                <label>
                  <small>Min</small>
                  <input type="number" min={floor} max={max} value={min} onChange={(e) => setMin(Math.max(floor, Math.min(Number(e.target.value) || floor, max)))} />
                </label>
                <span>–</span>
                <label>
                  <small>Max</small>
                  <input type="number" min={min} max={ceil} value={max} onChange={(e) => setMax(Math.min(ceil, Math.max(Number(e.target.value) || ceil, min)))} />
                </label>
              </div>
              {quickRanges.length > 1 && <div className="sa-chips">
                {quickRanges.map(([a, b, l]) => (
                  <button key={l} type="button" className={min === a && max === b ? "on" : undefined} onClick={() => (setMin(a), setMax(b))}>
                    {l}
                  </button>
                ))}
              </div>}
            </div>
          </Section>
          )}

          {sizeGroups.length > 0 && (
          <Section title="Size" count={sizes.length}>
            {sizeGroups.map((k) => (
              <div className="sa-sizes" key={k.id}>
                <small className="sa-sub">{k.title}</small>
                <div className="sa-chips">
                  {k.values.map((v) => {
                    const id = key(k.id, v);
                    const n = countBy("size", (p) => sizesOf(p).includes(id));
                    return (
                      <button key={id} type="button" className={sizes.includes(id) ? "on" : undefined} aria-pressed={sizes.includes(id)} disabled={!n && !sizes.includes(id)} onClick={() => setSizes((l) => toggle(l, id))}>
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </Section>
          )}

          {allColours.length > 1 && (
          <Section title="Colour" count={colours.length}>
            <div className="sa-swatches">
              {allColours.map((c) => {
                const n = countBy("colour", (p) => p.colour === c);
                return (
                  <button key={c} type="button" className={colours.includes(c) ? "on" : undefined} aria-pressed={colours.includes(c)} disabled={!n && !colours.includes(c)} onClick={() => setColours((l) => toggle(l, c))}>
                    <span className="dot" style={{ background: SWATCH[c] ?? "#ccc" }} />
                    {c}
                    <small>{n}</small>
                  </button>
                );
              })}
            </div>
          </Section>
          )}

          <button type="button" className="sa-show" onClick={() => setDrawer(false)}>
            Show {shown.length} {shown.length === 1 ? "product" : "products"}
          </button>
        </aside>
        {drawer && <button type="button" className="sa-scrim" aria-label="Close filters" onClick={() => setDrawer(false)} />}

        <div className="sa-main">
          <div className="sa-bar">
            <button type="button" className="sa-filter-btn" onClick={() => setDrawer(true)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Filters{chips.length ? ` (${chips.length})` : ""}
            </button>
            <span className="sa-total">
              {shown.length} {shown.length === 1 ? "product" : "products"}
            </span>
            <div className="sa-bar-right">
              <div className="sa-density" role="group" aria-label="Products per row">
                {[2, 3, 4].map((n) => (
                  <button key={n} type="button" className={cols === n ? "on" : undefined} aria-pressed={cols === n} aria-label={`${n} per row`} onClick={() => setCols(n)}>
                    {Array.from({ length: n }, (_, i) => (
                      <i key={i} />
                    ))}
                  </button>
                ))}
              </div>
              <label className="sa-sort">
                <span>Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                  <option value="featured">Featured</option>
                  <option value="new">New arrivals first</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="az">Name: A to Z</option>
                </select>
              </label>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="sa-active" aria-label="Active filters">
              {chips.map((c) => (
                <button key={c.label} type="button" onClick={c.off}>
                  {c.label}
                  <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </button>
              ))}
              <button type="button" className="sa-active-clear" onClick={clear}>
                Clear all
              </button>
            </div>
          )}

          {shown.length ? (
            <ProductGrid products={shown} cols={cols} />
          ) : (
            <div className="sa-empty">
              <b>No products match these filters.</b>
              <p>Try removing a filter, or browse a category.</p>
              <button type="button" onClick={clear}>
                Clear all filters
              </button>
              <Link href="/contact">Ask us on WhatsApp</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
