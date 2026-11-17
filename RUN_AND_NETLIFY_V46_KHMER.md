# LurnLurn Skincare V4.6 – Run & Deploy

## 1. Local development (Windows PowerShell in VS Code)
Open the **lurnlurnskincare** folder containing `package.json`.

```powershell
npm.cmd install
npm.cmd run dev
```

Open the Local URL shown by Vite.

## 2. Build for Netlify

```powershell
npm.cmd test
npm.cmd run build
```

If successful Vite creates the **dist** folder. Upload **dist** (not the ZIP, `src` or `node_modules`) to https://app.netlify.com/drop or update your existing Netlify site from Deploys.

## 3. Three frontends
- Storefront: `/` (index.html)
- Admin frontend: `/admin.html`
- Super Admin frontend: `/super-admin.html`

The Admin and Super Admin are **frontend shells** for backend integration. They do not have real database administration until `VITE_API_BASE_URL` is configured with a secure backend. Read `BACKEND_HANDOFF_V46.md`.

## 4. Telegram settings
Copy `.env.example` to `.env` and set `VITE_TELEGRAM_USERNAME` to the store's real public username (without @). This enables direct Telegram chat handoff. For chatbot-to-store **message relay**, the backend developer must implement the API endpoint from the handoff; Bot Token and Chat ID must stay in backend secrets, not `.env` used by Vite.

## 5. Sample product inventory
The demo catalog contains 39 named skincare items. Some products have stock=0 for testing the **Out of stock** state. All prices, inventory and campaign claims are sample data. Product photographs are external URLs: browser access and usage permissions matter. Review and replace with licensed store photos before production.

## 6. Checks before sharing
Test at phone (375/430), tablet (768/1024) and desktop widths. Open Shop All, select an out-of-stock item, confirm Add to Cart is disabled, open Payment demo, open Telegram link, verify 3-second promo rotation and manual Pause, verify Admin & Super Admin role gating.

## Important
No real payments, live stock, backend-synced orders or secure live admin actions are active in the purely static Netlify demo. Browser-only cart and orders do not sync across devices. `Kantumruy Pro` is an approximation to the Khmer font seen in the reference video.
