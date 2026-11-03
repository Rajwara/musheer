# Musheer store

Arabic menswear storefront built with Next.js (App Router, TypeScript). It was converted from the original static HTML template; the design, copy and behaviour are unchanged.

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
| `lib/navigation.ts` | Header mega-menu and footer links |
| `app/` | Routes: `/`, `/category/[slug]`, `/product/[slug]`, `/cart`, `/wishlist`, `/search`, `/policies/[slug]`, `/about`, `/contact`, `/stores`, `/journal`, `/account` |
| `components/` | UI; `StoreProvider` keeps the cart and wishlist in `localStorage` |
| `app/globals.css` | The original stylesheet |
| `public/images/` | SVG placeholders for every image |

Old static URLs (`product-foo.html`, `category-bar.html`, `cart.html`, …) redirect to the new routes.

## Images

`image-prompts.csv` lists every image the site uses. Put a photo in `public/` at the listed path (for example `public/images/hero/hero-adult.jpg`); `.jpg`, `.jpeg`, `.webp` and `.png` all replace the matching `.svg` placeholder. The lookup happens at build time, so rebuild after adding images.

## Before launch

Replace the sample products, prices and text; connect checkout, accounts and the contact form; and finalise the policies.
