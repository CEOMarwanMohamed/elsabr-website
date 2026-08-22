# الصبر — موقع الشركة

Marketing site for **الصبر لتوريد مستلزمات الشركات**, built with React + Vite and
deployed to Cloudflare Pages.

Imported from the Claude Design project *Paper products supplier website*
(`الصبر - الصفحة الرئيسية.dc.html`).

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
src/data/site.ts      all page copy and content — edit here, not in components
src/components/       one component + CSS module per section of the page
src/pages/            Home (imported design) and Catalog (placeholder)
src/styles/global.css design tokens and base styles
```

Content lives in `src/data/site.ts`. Changing a product line, a phone number, or a
commitment does not require touching layout code.

## Notes on the import

- The design's `style-hover` attributes became real CSS `:hover` rules.
- The card-stack drag/fling script was ported to `src/components/CardStack.tsx`,
  keeping the imperative transform handling so drags stay at pointer framerate.
- The page is RTL (`<html dir="rtl">`); numerals are wrapped in `<bdi>` so they
  render left-to-right inside Arabic copy, as in the design.

## Known gaps

- **The quote form has no backend.** It validates input and then hands the request
  to the visitor's mail client via `mailto:`. Replace `sendQuote()` in
  `src/components/QuoteForm.tsx` with a real endpoint (a Cloudflare Pages Function
  at `functions/api/quote.ts`, or a form service) before launch.
- **Placeholder contact details.** `src/data/site.ts` still carries the design's
  dummy phone (`0100 000 0000`) and email (`sales@example.com`).
- **Client logos are placeholders** — the marquee in `src/components/Clients.tsx`
  renders eight empty slots.
- **The catalog page is a stub.** `الكتالوج.dc.html` in the design project has not
  been imported yet.

## Deploying to Cloudflare Pages

### One-off deploy from your machine

```bash
npx wrangler login
npm run deploy
```

### Automatic deploys from GitHub

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
It needs two repository secrets:

- `CLOUDFLARE_API_TOKEN` — a token with the **Cloudflare Pages: Edit** permission
- `CLOUDFLARE_ACCOUNT_ID` — from the Cloudflare dashboard sidebar

Alternatively, connect the repo directly in the Cloudflare dashboard
(Workers & Pages → Create → Pages → Connect to Git) with:

- Build command: `npm run build`
- Build output directory: `dist`
