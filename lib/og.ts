import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

/** Public address of the site, used to turn share-image paths into full URLs. */
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://musheer-two.vercel.app"),
);

/**
 * Share-preview tags (Open Graph + Twitter) for a page. `image` is a key of a
 * 1200x630 JPG in public/og/ (made by scripts/make-og-images.py); missing
 * keys fall back to the default image.
 */
export function share(title: string, description: string, image: string, type: "website" | "article" = "website"): Metadata {
  const file = fs.existsSync(path.join(process.cwd(), "public", "og", `${image}.jpg`)) ? image : "default";
  const img = { url: `/og/${file}.jpg`, width: 1200, height: 630, alt: title };
  const full = title.includes("Al Musheer") ? title : `${title} | Al Musheer`;
  return {
    openGraph: { title: full, description, images: [img], siteName: "Al Musheer", type, locale: "en_AE" },
    twitter: { card: "summary_large_image", title: full, description, images: [img.url] },
  };
}
