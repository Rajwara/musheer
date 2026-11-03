# Al Musheer store

Online store for Al Musheer, kandura tailoring since 1998, built with Next.js (App Router, TypeScript). The colours come from the Al Musheer logo, and the brand copy is adapted from the store's existing website.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

| Path | What |
| --- | --- |
| `lib/data/products.json` | 76 sample products: name, colour, price, category, options (size, length…), description, related items |
| `lib/data/categories.json` | 26 categories: title, sidebar group, product order |
| `lib/data/home.json` | Home page "Best sellers" and "Featured" lists |
| `lib/brand.ts` | Brand copy, WhatsApp number, social links, stats, services, home-tailoring steps, the **branch list**, announcement-bar messages (`ANNOUNCEMENTS`) and the sign-up popup settings (`OFFER`) |
| `lib/navigation.ts` | Header mega-menu and footer links |
| `app/(site)/` | Store routes (one root layout with the header, footer and `globals.css`): `/`, `/category/[slug]`, `/product/[slug]`, `/cart`, `/wishlist`, `/search`, `/policies/[slug]`, `/about`, `/branches`, `/contact`, `/journal`, `/account` |
| `components/` | UI; `StoreProvider` keeps the cart and wishlist in `localStorage`, `Motion` holds all GSAP animations, `QuickView` is the product pop-up, `BranchLocator` is the store finder |
| `app/(site)/globals.css` | Styles; colour tokens (`--primary`, `--navy`, `--accent`…) are at the top |
| `public/logo.png`, `public/logo-white.png`, `app/icon.png` | Logo for light backgrounds, dark backgrounds, and the favicon |
| `public/images/` | Photos (WebP) in `categories/`, `hero/`, `content/`, `pages/` (page banners) and `community/` (video posters); SVG illustrations are the fallback, and are still used for product views |
| `public/videos/community/` | The short vertical videos on the home page (540x960 MP4) |

Old static URLs (`product-foo.html`, `category-bar.html`, `cart.html`, …) redirect to the new routes.

## Images

Every image is an SVG illustration drawn by `scripts/generate-illustrations.py`: each product in its real colour (front, side and back views), the category tiles, the four hero banners and the story image. To change colours or styles, edit the script and run:

```bash
python3 scripts/generate-illustrations.py
```

To use real photos, put a photo in `public/` at a path listed in `image-prompts.csv` (for example `public/images/hero/hero-adult.jpg`). `.jpg`, `.jpeg`, `.webp` and `.png` all take priority over the `.svg` with the same name. The CSV also has a generation prompt for each image. The lookup runs at build time, so rebuild after adding photos.

## Test pages

- `/test-mock`: the Milano category and features sections and the "Where we operate" markets section, inside the store layout.
- `/test-mock-2`: the Fieldworn homepage, a complete standalone page. It lives in `app/(mock)/` with its **own root layout**, so none of the store's styles, header or footer load there (their class names overlap). Its placeholder images are mapped to store images in `app/(mock)/test-mock-2/page.tsx`.
- `/test-mock-3`: the Logotype homepage, also standalone in `app/(mock)/`. It shows grey placeholders until images are uploaded: put a file named after its slot (e.g. `hero-1b.webp`) in `public/images/test-mock-3/` and rebuild. The slot list and sizes are in `public/images/test-mock-3/README.md`.

Because the app now has two root layouts, unmatched URLs are served by `app/global-not-found.tsx` (enabled with `experimental.globalNotFound` in `next.config.ts`). Moving between the store and `/test-mock-2` is a full page load.

## Branch finder

The Branches page has a map with a pin per branch, a search box (area or city, e.g. "Mirdif"), "Use my location", and the nearest branches listed with distances and **Get directions** links. Hovering a pin shows a photo of that branch.

- Branch details live in `BRANCHES` in `lib/brand.ts`. The `lat`/`lng` values are **approximate** (placed by area); set each store's exact coordinates before launch (in Google Maps, right-click the store and copy the numbers).
- Add a photo per branch at `public/images/branches/<id>.webp` (the `id` is in the same list). Until then the hover card shows one of the store photos.
- Common UAE areas resolve instantly from `lib/places.ts`; anything else is looked up with OpenStreetMap's free search. The map uses CARTO's free basemap; keep the attribution.

## Animations

All motion is in `components/Motion.tsx` (GSAP + ScrollTrigger): hero intro and parallax, section reveals, staggered product cards, wipe-in category tiles and images, counting stats. It switches off automatically for visitors who prefer reduced motion.

## Video testimonials ("From the community")

The home page has a swipeable row of 9:16 videos. Each has the poster's handle, play/pause and mute buttons, and a "Shop the Look" button that lists the products worn. Visible clips autoplay muted, and the row has arrows and a progress bar.

It currently shows the store's own craft clips under @almusheer. To add customer videos, edit `COMMUNITY` in `lib/brand.ts`:

1. Put the video in `public/videos/community/` (MP4, H.264, 9:16, ideally under 3 MB) and a poster image in `public/images/community/`.
2. Add an entry with the customer's handle, the file paths, and the product slugs they are wearing.
3. Set `verified: true` only for accounts that Instagram has actually verified.

## Sign-up popup

A "Limited Time Offer" popup asks visitors for their email. It opens 8 seconds after arrival (or sooner when a desktop visitor moves to leave), shows a 30-minute countdown that survives refreshes, and stays hidden for 3 days after it is closed, or for good once someone signs up. Change the wording, timings and the trust points in `OFFER` in `lib/brand.ts`.

Sign-ups go to `POST /api/subscribe`. Set the `SUBSCRIBE_WEBHOOK_URL` environment variable to a webhook (Zapier, Make, a Google Apps Script that writes to a sheet, or your mailing-list provider) and each sign-up is forwarded as `{ email, source, signedUpAt }`. Without it, sign-ups are only written to the server log.

## Before launch

- Check the branch names and areas in `lib/brand.ts` and add each branch's phone number (the `phone` field); they were read from a small screenshot of the old site.
- Set `SUBSCRIBE_WEBHOOK_URL` so popup sign-ups are saved, and decide what discount subscribers receive.
- Replace the sample products and prices; connect checkout, accounts and the contact form; and finalise the policies.
