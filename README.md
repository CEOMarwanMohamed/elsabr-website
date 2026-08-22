# الصبر — موقع الشركة

Marketing site and product catalog for **الصبر لتوريد مستلزمات الشركات**, built
with React + Vite and deployed to Cloudflare Pages.

Imported from the Claude Design project *Paper products supplier website*
(`الصبر - الصفحة الرئيسية.dc.html` and `الكتالوج.dc.html`).

## Stack

- **React 19** + **TypeScript**, bundled by **Vite 7**
- **React Router** for routing
- **CSS Modules** for component styles, with design tokens in `src/styles/global.css`
- **Cloudflare Pages** for hosting

## Local development

```bash
npm install
npm run dev        # dev server on http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
```

## Project layout

```
public/assets/        logos (elsabr-logo.png, elsabr-logo-light.png)
public/_redirects     SPA fallback for Cloudflare Pages
public/_headers       cache + security headers
src/data/site.ts      home page copy and contact details
src/data/catalog.ts   the 36 catalog products (generated from the design)
src/cart/             cart state (localStorage) + WhatsApp order builder
src/components/       one component + CSS module per section
src/pages/            Home and Catalog
src/styles/global.css design tokens and base styles
```

Content lives in `src/data/`. Changing a product, a phone number, or a
commitment does not require touching layout code.

## The catalog and cart

`/catalog` renders six category tabs over 36 products, with an in-stock filter
and price sorting. The active tab is mirrored into the URL hash, so
`/catalog#pantry` opens on البوفيه.

The cart is a **quote request, not a checkout**. There is no payment step, and no
prices are ever sent: adding items builds a WhatsApp message listing each
product, its code, unit, and quantity, plus optional notes. It persists in
`localStorage` under `sabr-cart-v1` — the same key the design used — so a cart
survives reloads.

The cart button sits in the header on the catalog, and appears on other pages
only once the cart has something in it, so a cart started on the catalog is
never stranded.

## Notes on the import

- The design's `style-hover` attributes became real CSS `:hover` rules.
- The home page card-stack drag/fling script was ported to
  `src/components/CardStack.tsx`, keeping the imperative transform handling so
  drags stay at pointer framerate.
- The catalog's tab/filter/sort/cart script became React state; the cart moved
  into a context so the header, drawer, and floating button share it.
- The page is RTL (`<html dir="rtl">`); numerals are wrapped in `<bdi>` so they
  render left-to-right inside Arabic copy, as in the design.
- Responsive breakpoints were added — the source canvas had fixed layouts.

## Known gaps

- **Catalog data is demo data.** The design says so on the page itself, and
  `src/data/catalog.ts` is generated from it. Replace with real products.
- **The six ورق التصوير product photos are not in this repo.** Every product has
  `image: null` and renders a monogram block instead. The original filenames are
  kept beside each one as `// design asset: assets/cat-cpN.webp`. To restore a
  photo: copy the file into `public/assets/` and set `image` to its path.
  `ProductCard` falls back to the monogram if an image fails to load, so a wrong
  path degrades quietly rather than showing a broken image. (In the source
  design, `cat-cp1` and `cat-cp2` are the same image.)
- **The home page quote form has no backend.** It validates input and then hands
  the request to the visitor's mail client via `mailto:`. Replace `sendQuote()`
  in `src/components/QuoteForm.tsx` with a real endpoint (a Cloudflare Pages
  Function at `functions/api/quote.ts`, or a form service).
- **Placeholder contact details.** `src/data/site.ts` carries the design's dummy
  phone (`0100 000 0000`), WhatsApp number, and email (`sales@example.com`).
  The design's home page had an invalid `tel:+2001000000000`; the valid form
  from the catalog page is used throughout.
- **Client logos are placeholders** — the marquee in `src/components/Clients.tsx`
  renders eight empty slots.

## Deploying to Cloudflare Pages

### One-off deploy from your machine

```bash
npx wrangler login
npm run deploy
```

### Automatic deploys from GitHub

`.github/workflows/deploy.yml` builds on every push and pull request, and
publishes to Cloudflare Pages once these two repository secrets exist:

- `CLOUDFLARE_API_TOKEN` — a token with the **Cloudflare Pages: Edit** permission
- `CLOUDFLARE_ACCOUNT_ID` — from the Cloudflare dashboard sidebar

Until they are set, the deploy step is skipped and the build still reports green.

Alternatively, connect the repo directly in the Cloudflare dashboard
(Workers & Pages → Create → Pages → Connect to Git) with:

- Build command: `npm run build`
- Build output directory: `dist`

If you use the dashboard integration, delete `.github/workflows/deploy.yml` so
both systems aren't deploying the same commit.
