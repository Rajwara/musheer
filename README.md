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
| `app/` | Routes: `/`, `/category/[slug]`, `/product/[slug]`, `/cart`, `/wishlist`, `/search`, `/policies/[slug]`, `/about`, `/branches`, `/contact`, `/journal`, `/account` |
| `components/` | UI; `StoreProvider` keeps the cart and wishlist in `localStorage` |
| `app/globals.css` | Styles; colour tokens (`--primary`, `--navy`, `--accent`…) are at the top |
| `public/logo.png`, `public/logo-white.png`, `app/icon.png` | Logo for light backgrounds, dark backgrounds, and the favicon |
| `public/images/` | SVG illustrations for every product view, category tile, hero banner and the story image |

Old static URLs (`product-foo.html`, `category-bar.html`, `cart.html`, …) redirect to the new routes.

## Images

Every image is an SVG illustration drawn by `scripts/generate-illustrations.py`: each product in its real colour (front, side and back views), the category tiles, the four hero banners and the story image. To change colours or styles, edit the script and run:

```bash
python3 scripts/generate-illustrations.py
```

To use real photos, put a photo in `public/` at a path listed in `image-prompts.csv` (for example `public/images/hero/hero-adult.jpg`). `.jpg`, `.jpeg`, `.webp` and `.png` all take priority over the `.svg` with the same name. The CSV also has a generation prompt for each image. The lookup runs at build time, so rebuild after adding photos.

## Sign-up popup

A "Limited Time Offer" popup asks visitors for their email. It opens 8 seconds after arrival (or sooner when a desktop visitor moves to leave), shows a 30-minute countdown that survives refreshes, and stays hidden for 3 days after it is closed, or for good once someone signs up. Change the wording, timings and the trust points in `OFFER` in `lib/brand.ts`.

Sign-ups go to `POST /api/subscribe`. Set the `SUBSCRIBE_WEBHOOK_URL` environment variable to a webhook (Zapier, Make, a Google Apps Script that writes to a sheet, or your mailing-list provider) and each sign-up is forwarded as `{ email, source, signedUpAt }`. Without it, sign-ups are only written to the server log.

## Before launch

- Check the branch names and areas in `lib/brand.ts` and add each branch's phone number (the `phone` field); they were read from a small screenshot of the old site.
- Set `SUBSCRIBE_WEBHOOK_URL` so popup sign-ups are saved, and decide what discount subscribers receive.
- Replace the sample products and prices; connect checkout, accounts and the contact form; and finalise the policies.
