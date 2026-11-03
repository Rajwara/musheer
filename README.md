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
| `public/images/` | SVG illustrations for every product view, category tile, hero banner and the story image |

Old static URLs (`product-foo.html`, `category-bar.html`, `cart.html`, …) redirect to the new routes.

## Images

Every image is an SVG illustration drawn by `scripts/generate-illustrations.py`: each product in its real colour (front, side and back views), the category tiles, the four hero banners and the story image. To change colours or styles, edit the script and run:

```bash
python3 scripts/generate-illustrations.py
```

To use real photos, put a photo in `public/` at a path listed in `image-prompts.csv` (for example `public/images/hero/hero-adult.jpg`). `.jpg`, `.jpeg`, `.webp` and `.png` all take priority over the `.svg` with the same name. The CSV also has a generation prompt for each image. The lookup runs at build time, so rebuild after adding photos.

## Before launch

Replace the sample products, prices and text; connect checkout, accounts and the contact form; and finalise the policies.
