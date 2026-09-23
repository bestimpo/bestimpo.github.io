# Bestimpo

Static storefront for **Bestimpo** — electronics and smart gadgets.

Live at <https://bestimpo.github.io/>.

## Summary

A shop that needs no server. The catalog is a typed TypeScript array, the cart lives in the
browser, and a placed order arrives as an email — so the whole site is static files on GitHub
Pages, free to host and impossible to take down with a bad deploy.

- **To add stock**, edit one file: `src/data/products.ts`. Set `price` and `discountPercent`; the
  sale price, badge and struck-through original appear everywhere on their own.
- **To change the shop's details** (email, phone, currency, shipping, socials), edit
  `src/data/site.ts`.
- **Orders** go through EmailJS to your inbox. No card is charged on the site; you confirm payment
  and delivery by reply. Unconfigured keys are stated on the page, with a mail-client fallback.
- **Two languages.** English and Bengali (বাংলা), switched from the header and remembered per
  visitor. Prices follow the language: `৳14,900` in English, `৳১৪,৯০০` in Bengali.
- **Deploys** happen on push to `main` via GitHub Actions. Routing is hash-based, so deep links
  survive a refresh on Pages.
- 7 pages: home, shop (search, category, sort, stock filters), product detail, checkout, about,
  contact, 404.

Stack: React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router 7, EmailJS. No backend, no
database, no payment integration.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then paste your EmailJS keys in
npm run dev                  # http://localhost:5173
```

Other scripts:

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                    |
| `npm run build`     | Type-check, then build to `dist/`             |
| `npm run preview`   | Serve the built `dist/` locally               |
| `npm run typecheck` | Types only, no build                          |

---

## Adding a product

Everything about the shop's stock is in **`src/data/products.ts`**. One entry per product:

```ts
{
  id: 'pulse-air-pro-anc-earbuds',   // unique + URL-safe; becomes /#/product/<id>
  name: 'Pulse Air Pro ANC Earbuds',
  brand: 'Bestimpo Audio',
  category: 'audio',                  // must be one of the slugs in src/data/categories.ts
  price: 15900,                       // full list price, in BDT
  discountPercent: 30,                // omit for no sale — sale price is computed for you
  images: [                           // first one is the card image; the rest
    'products/pulse-air-pro.svg',     // become arrows + thumbnails + zoom on
    'products/pulse-air-pro-detail.svg',  // the product page
    'products/pulse-air-pro-box.svg',
  ],
  shortDescription: 'One line for the product card.',
  description: 'A paragraph for the product page.',
  highlights: ['Bullet 1', 'Bullet 2'],
  specs: { Driver: '11 mm', Warranty: '12 months' },
  stock: 24,                          // 0 renders "Sold out" and blocks add-to-cart
  rating: 4.7,
  reviewCount: 312,
  featured: true,                     // shows in the home page "Featured" rail
  badge: 'Best seller',               // optional corner label
}
```

**Prices.** `price` is the list price and `discountPercent` is the percent off it. Set
`discountPercent: 25` and the card shows a `-25%` badge, the list price struck through, and the
discounted price everywhere else — cart and order email included. TypeScript fails the build if a
field is missing or a category slug is wrong, so a typo cannot reach the live site.

**Images.** Drop files in `public/products/` and reference them as `products/your-file.jpg`.
Full `https://…` URLs also work. List as many as you like: the first is the card image, and the
product page turns the rest into a gallery with prev/next arrows, a thumbnail strip, a counter,
arrow-key navigation and a click-to-zoom full-size view. One image is fine too — the gallery
controls simply do not appear. The current files are generated placeholders (three views per
product); replace them with real photos.

**Currency.** Prices are plain numbers in BDT — write `15900`, not `"৳15,900"`. Grouping, digits
and the symbol are applied for you. To use a different currency, change `site.currency.symbol` in
`src/data/site.ts` and the locales in `src/i18n/index.ts`.

Other things you may want to edit:

| File                      | Holds                                                        |
| ------------------------- | ------------------------------------------------------------ |
| `src/data/site.ts`        | Shop name, email, phone, address, socials, currency, shipping |
| `src/data/categories.ts`  | The six category shelves                                     |
| `src/index.css`           | Brand colours (`@theme`), fonts, button and card styles      |
| `public/favicon.png`      | Tab icon (generated from `src/assets/logo.png`)              |

Currency lives in `site.currency` — change `symbol`, `code` and `locale` together to switch from
USD to anything else.

---

## Languages (English + বাংলা)

The header has an **EN / বাং** switch. The choice is stored per visitor in `localStorage` and sets
`<html lang>`, which also swaps in the Noto Sans Bengali webfont.

| What | Where |
| ---- | ----- |
| Interface text (buttons, labels, headings, forms) | `src/i18n/en.ts` and `src/i18n/bn.ts` |
| Product names, descriptions, highlights | `src/data/products.bn.ts`, keyed by product `id` |
| Category names and blurbs | the `categories` / `categoryBlurbs` sections of the dictionaries |
| Spec labels (Battery, Warranty, …) | the `specs` section of the dictionaries |

**Adding a UI string:** add the key to `en.ts`, then to `bn.ts`. `bn.ts` is typed against the
English file, so a missing key is a build error rather than a silent gap. Use it in a component
with `const { t } = useLanguage()` and `t('section.key')`. Placeholders interpolate:
`t('common.onlyLeft', { count: 3 })`.

**Translating a product:** add an entry in `src/data/products.bn.ts` under the product's `id`.
Every field is optional and falls back field by field, so you can list a product in English today
and translate it later without anything breaking:

```ts
'my-product-id': {
  name: 'পণ্যের নাম',
  shortDescription: 'কার্ডে যে এক লাইন দেখাবে।',
  // description, highlights, brand, badge, specs — all optional
},
```

Prices need no translation: `৳14,900` in English becomes `৳১৪,৯০০` in Bengali automatically, since
`bn-BD` switches both the digits and the grouping to lakh style. Search matches either language, so
a Bengali term still finds an English-only product.

## Orders by email (EmailJS)

Checkout does not take payment. It emails the order to you, and you confirm payment and delivery
directly with the customer.

1. Create a free account at <https://dashboard.emailjs.com>.
2. Add an **email service** (Gmail, Outlook, SMTP…) and note the **Service ID**.
3. Create **two templates** and note each **Template ID**:
   - an order template, and
   - a contact-form template.
4. Copy your **Public Key** from Account → General.
5. Put all four in `.env.local`:

   ```bash
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_ORDER_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_CONTACT_TEMPLATE_ID=template_yyyyyyy
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
   ```

Until those are set, the checkout and contact pages say so plainly and the checkout offers a
mail-client fallback instead of failing silently.

### Template variables

The order template can use any of these:

`{{order_id}}` `{{order_date}}` `{{shop_name}}` `{{customer_name}}` `{{customer_email}}`
`{{customer_phone}}` `{{shipping_address}}` `{{payment_method}}` `{{notes}}` `{{item_count}}`
`{{order_items}}` `{{subtotal}}` `{{savings}}` `{{shipping}}` `{{total}}`

`{{order_items}}` is a ready-made plain-text table of the lines and totals — the simplest template
is just that plus the customer block.

The contact template uses: `{{from_name}}` `{{from_email}}` `{{subject}}` `{{message}}`
`{{shop_name}}`.

### A note on the keys

An EmailJS public key is designed to sit in client-side JavaScript, so it will be visible in the
built bundle — that is normal and not a leak. Do still lock it down in the EmailJS dashboard:
enable the allow-list and add your domain, so nobody can drive your template from elsewhere.
Never put an EmailJS *private* key in this repo.

---

## Deploying

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

One-time setup:

1. **Settings → Pages → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions → Variables** — add the four `VITE_EMAILJS_*`
   values. Without them the site builds fine but cannot send orders.
3. Push to `main`. The workflow builds, then deploys.

### Routing

The app uses `HashRouter`, so URLs look like `/#/shop` and `/#/product/<id>`. GitHub Pages serves
static files only — with normal paths, refreshing `/shop` would 404. Hash routes never reach the
server, so every link is shareable and reload-safe with no redirect hack.

There are two 404s, and they cover different misses:

| Where | File | When it shows |
| ----- | ---- | ------------- |
| In the app | `src/pages/NotFound.tsx` | An unknown hash route, e.g. `/#/nope` — renders inside the site, with nav and footer |
| At the server | `public/404.html` | A path Pages cannot find, e.g. someone types `bestimpo.github.io/shop` with no `#` |

`public/404.html` is standalone (its own inline CSS, no app bundle) and forwards the path to the
matching hash route — `/shop` becomes `/#/shop`, `/product/foo` becomes `/#/product/foo`. A path
with no real route lands on the in-app 404. With JavaScript off it stays put and shows its own
branded page with links. If you move to a project page, update `BASE` in its inline script to
`/<repo>/` alongside `VITE_BASE`.

### Base path

This repo is `bestimpo.github.io`, a user/org site served at the domain root, so the base stays `/`.
For a **project** page (`https://<user>.github.io/<repo>/`) set `VITE_BASE=/<repo>/` in the
workflow's build env and in `.env.local`.

### Custom domain

To serve the shop at `bestimpo.com`:

1. Point DNS at GitHub — four `A` records for the apex (`185.199.108-111.153`), or a `CNAME` on
   `www` to `bestimpo.github.io`.
2. Add the domain under **Settings → Pages → Custom domain**. GitHub commits a `CNAME` file for
   you; if you prefer, create `public/CNAME` containing just `bestimpo.com` so the build always
   emits it.
3. Tick **Enforce HTTPS** once the certificate is issued.
4. Update `site.domain` and `site.email` in `src/data/site.ts`.

---

## How it is put together

```
public/
├── 404.html             server-level 404 + deep-link forwarder
├── favicon.png
├── og-image.png
└── products/            product photos (placeholders for now)

src/
├── App.tsx              routes
├── main.tsx             entry, HashRouter
├── index.css            Tailwind theme: brand colours, fonts, components
├── types.ts             Product, Category, CartLine, OrderCustomer
├── assets/logo.png      the logo
├── data/
│   ├── products.ts      THE CATALOG — edit this
│   ├── products.bn.ts   Bengali product text, keyed by id
│   ├── categories.ts    category shelves
│   └── site.ts          shop details, currency + EmailJS config
├── i18n/
│   ├── en.ts            English UI strings (source of truth)
│   ├── bn.ts            Bengali UI strings (typed against en.ts)
│   ├── product.ts       merges Bengali product text over English
│   └── LanguageContext.tsx  active language, t(), price formatting
├── lib/
│   ├── format.ts        price formatting, discount maths, asset URLs
│   ├── email.ts         EmailJS order + contact senders, mailto fallback
│   └── useLocalStorage.ts
├── context/CartContext.tsx   cart state, persisted to localStorage
├── components/          Navbar, Footer, ProductCard, ProductGallery, CartDrawer…
└── pages/               Home, Shop, ProductDetail, Checkout, About, Contact, NotFound
```

The cart lives in `localStorage` under `bestimpo.cart.v1`. On load it drops products that no longer
exist in the catalog and clamps quantities to current stock, so an old cart cannot check out
something you have since removed or sold out.

---

## License

Private project. Logo and product copy belong to Bestimpo.
