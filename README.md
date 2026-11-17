# LurnLurn Skincare V4.8 — Secure Admin & Super Admin

**Start here:** `RUN_V48_KHMER.md` (Khmer installation/deployment) and `BACKEND_HANDOFF_V48.md` (API contract, security & analytics payloads).

Staff pages use **backend email/password only**; there is no demo administrator bypass. Without `VITE_API_BASE_URL` staff login stays disabled. Customer storefront retains some demo state and requires a separate production backend integration.

---

# LurnLurn Skincare V4.7 — Storefront + Admin & Super Admin Demo

**Start here:** [`DEMO_ADMIN_SUPER_ADMIN_KHMER.md`](DEMO_ADMIN_SUPER_ADMIN_KHMER.md). Run `npm.cmd install` and `npm.cmd run dev`, then open `/admin.html` or `/super-admin.html` for one-click demo access. Roles are only demo previews with browser-local data, not secure login. Backend notes: [`BACKEND_HANDOFF_V47.md`](BACKEND_HANDOFF_V47.md).

---

# LurnLurn Skincare — Video Reference Update (v4.5)

**Start with `DEMO-VIDEO-UPDATE-KHMER.md` for the latest features.** This codebase includes a local (rule-based) floating chat, a Telegram handoff, a search overlay, 16 video-reference demo products, and the original store features.

**Video-reference products use illustrative SVG images, not official manufacturer photography. Prices, stocks and discounts are sample values.**

# LUMI SKINCARE V4 — Motion + Checkout Prototype

A responsive React SPA inspired by the uploaded skincare reference and the LUMI V3 motion concept. This project preserves the V3 editorial visual components while adding a working **demo** purchase journey.

## Stack

- HTML5 (`index.html`)
- CSS3 (`src/style.css` contains the V3 motion design; `src/v4.css` contains the V4 responsive design system)
- Tailwind CSS 3 (`src/tailwind.css`, `tailwind.config.cjs`, PostCSS; preflight disabled to protect original V3 CSS)
- JavaScript / JSX (React 18 UI library)
- Vite 6 (development/build tool)
- Optional Supabase Auth using an environment config (no Supabase required for browser demo mode)
- Lucide React icons

## Run in Windows / VS Code

1. Unzip the downloaded archive.
2. In VS Code, **open the inner `lumi-skin` folder** containing `package.json`.
3. Open **Terminal → New Terminal**.
4. Use:

```powershell
npm.cmd install
npm.cmd run dev
```

5. Open the **Local** URL Vite prints (commonly `http://localhost:5173/`).

Create a production build with `npm.cmd run build` after installing dependencies.

## Test complete shopping journey

1. Home → Shop all → product detail → Add to bag.
2. Bag → adjust quantity → **Checkout**.
3. Not logged in? Register / login in **DEMO MODE** (name and email, no password).
4. Add a delivery address (Cambodian province, district and street), choose a courier, add a note.
5. Continue to Payment → review pro-forma invoice.
6. Choose COD or an online option, accept the demo disclosure and save the **demo order**.
7. Account → My orders displays the saved browser-local order (never marked paid).

## New V4 features

- Login/Register page with navigation return-to-checkout
- Optional real Supabase Auth (see `SUPABASE_AUTH_SETUP.md`)
- Cart quantities, remove product, demo coupon `GLOW10`
- Address creation and selection
- Delivery choices: J&T Express, PP Delivery, VET Express, ZTO Express (all fees are illustrative)
- Invoice-style payment review: COD, ABA KHQR, KHQR, Visa (online methods are **not connected**)
- Order confirmation and per-demo-user order history
- Khmer / English UI switch (core interfaces translated; product names, descriptions and manufacturer benefit research stay in English)
- Light / dark toggle
- USD / KHR currency display toggle (estimated rate from `VITE_KHR_PER_USD`, defaults to 4000; not a live FX quote)
- Promotions page, searchable catalog, brand filters, skin concerns, and skin quiz
- V3 logo marquee, product gallery, cinematic hero and 3-second featured slideshow
- Manufacturer-sourced benefit highlights with links to source pages
- Telegram contact (configure public username via `VITE_TELEGRAM_USERNAME` or `/demo-admin` browser settings)
- CSS transitions, scroll reveals, and prefers-reduced-motion support

## Important security and business limitations

- The **default demo identity is not authentication**. It saves a display name/email in localStorage only and uses **no password**. Never market this as secure registration. For actual email/password authentication, configure Supabase Auth; see setup guide.
- Supabase Auth does **not** create a production order backend. Orders, addresses, cart and other demo state still live in **browser localStorage**, and can be edited, lost or impersonated. Never use it for real inventory or fulfillment.
- The checkout does **not** collect real funds. ABA KHQR, KHQR, and Visa are **UI-only** and create an explicitly **UNPAID/PENDING DEMO** order. The COD option records a **COD/NOT PAID DEMO** order; it does not dispatch a courier.
- There is no valid dynamic KHQR code, no card form, and no payment verification. Use an approved payment provider and a secure server-side callback before accepting orders.
- Do not add payment API keys or Supabase `service_role` credentials to `VITE_` variables. Values prefixed `VITE_` are exposed in the browser bundle.
- Product names are real. Prices, sale labels, quantities, shipping fees, and inventory are examples. Third-party product image URLs may expire or require permission before commercial use.
- Customer addresses and order notes contain personal data. Test with sample information; browser-local data is not appropriate for a production shop.
- `/demo-admin` is intentionally an unprotected sample settings page, not a secure admin panel.
- Keep `node_modules/`, `.env` and `dist/` out of Git.

## Structure

```
lumi-skin/
├── index.html                    # HTML entry point
├── package.json                  # React, Vite, Tailwind, Supabase client
├── tailwind.config.cjs           # Tailwind customization
├── postcss.config.cjs
├── vercel.json                   # React SPA route fallback
├── .env.example                  # Optional non-secret client configuration
├── src/
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # navigation, cart, account, checkout orchestration
│   ├── auth.js                   # optional Supabase email/password auth
│   ├── catalog.js                # product facts and manufacturer benefit links
│   ├── data.js                   # demo product catalog / images
│   ├── store.js                  # localStorage helper + pricing exports
│   ├── pricing.js                # pure courier options and order totals
│   ├── i18n.js                   # EN / Khmer interface strings
│   ├── components/
│   │   ├── UI.jsx                # header, cards, order rows, summary
│   │   └── Editorial.jsx        # preserved V3 animated motion components
│   ├── pages/
│   │   └── Pages.jsx            # Home, Shop, Product, Quiz, Cart, Checkout, Payment, etc
│   ├── style.css                 # preserved V3 styles
│   ├── v4.css                    # new design system, responsive, dark mode
│   └── tailwind.css              # tailwind utility layer
└── docs/
    ├── PAYMENT_AND_SECURITY.md
    ├── PRODUCT_RESEARCH.md
    └── QA_CHECKLIST.md
```

## GitHub and deployment

From the inner `lumi-skin` folder:

```powershell
git init
git add .
git commit -m "LUMI SKINCARE V4 shopping flow"
```

Then attach your actual GitHub repository remote and push. To share a live demo use Vercel importing this repo; framework Vite, root directory `./` when the repo itself is the inner `lumi-skin` folder, output directory `dist`.

This repository is intentionally a **high-fidelity frontend prototype**, not a completed live e-commerce service.

Run pure-logic tests (does not require npm install): `npm.cmd test` or `node --test tests/*.test.js`.


## V4.4 — Admin Dashboard
Dashboard route: `/admin`. Name: Admin. Owner email: `bunyanban20@gmail.com`. Demo access is browser-only and not secure. For a role-protected version, see `docs/ADMIN_SETUP_KHMER.md` and `supabase/admin_setup.sql`. Admin manages local sample orders and product overrides; customer orders are not yet server-backed.
