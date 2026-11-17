# LurnLurn Skincare V4.7 — Admin & Super Admin Demo (KH/EN)

## ចូលប្រើ Dashboard ឥឡូវនេះ (មិនត្រូវការ Backend)

1. Extract ZIP, then **open the inner `lurnlurnskincare` folder** in VS Code. That folder contains `package.json`.
2. Windows PowerShell:

   ```powershell
   npm.cmd install
   npm.cmd run dev
   ```

3. Open the URLs printed by Vite, typically:
   - **Storefront:** http://localhost:5173/
   - **Admin:** http://localhost:5173/admin.html
   - **Super Admin:** http://localhost:5173/super-admin.html
4. On Admin click **Continue as Demo Admin**.
5. On Super Admin click **Continue as Demo Super Admin**.

The **Admin** sample displays `Admin / bunyanban20@gmail.com`. The Super Admin sample displays `Super Admin / superadmin@lurnlurn.demo`. Neither is an account or password. They are public demo labels. No secret passwords are included. Do not enter your real password in demo mode.

### Admin UI

- Overview: cards, recent order activity, basic chart, quick actions.
- Products: search, stock filters, price/stock edit, active/hidden, add demo products, CSV export.
- Orders: list and filter, details, fulfillment status, sample payment status. No real payment confirmation.
- Conversations: preview, write sample reply, mark resolved. Does **not** send Telegram messages.
- Promotions: create/edit/pause/remove sample campaigns; carousel on the *same browser origin* displays active promotions.

### Super Admin UI

Everything above, plus:
- Team: sample member records (no real user creation or permission grants).
- Settings: store display metadata + sample Telegram username, reset demo.
- Audit: local action history + CSV export.

## Simple cross-page test (in the same browser)

1. In `/admin.html` click Continue as Demo Admin.
2. Go to Products. Edit e.g. **SKIN1004 Madagascar Centella Ampoule** and set `Stock = 0`.
3. Open `/shop` in a tab on the **same domain and browser**. That item should show **Out of stock**.
4. Go to Promotions and pause a campaign. Reload `/` to see the 3-second carousel using active campaigns.
5. Go to `/super-admin.html`, click Continue as Demo Super Admin, explore Team/Settings/Audit.

**Data scope:** Browser localStorage (product stock, demo orders, promotions, chats, settings) and sessionStorage (demo staff sign-in). Refresh keeps sample edits. Browsers and different phones do **not** share changes. Private browsing or clearing site storage will lose data. Example customer orders placed in the storefront on this browser can appear in the local Admin order list.

## Netlify deployment

1. In VS Code terminal run:

   ```powershell
   npm.cmd install
   npm.cmd test
   npm.cmd run build
   ```

2. Deploy the generated `dist` folder to Netlify Drop or import the repository and let Netlify build it.
3. Open:
   - `https://YOUR-SITE.netlify.app/`
   - `https://YOUR-SITE.netlify.app/admin.html`
   - `https://YOUR-SITE.netlify.app/super-admin.html`

For a public demo, anyone who receives the staff URLs can open the preview. No business data, real passwords or private customer details should be entered. To test safely, use invented names, addresses and orders.

## For the backend developer

- HTML entrypoints are `index.html`, `admin.html`, `super-admin.html`.
- API bridge exists in `src/services/api.js` using `VITE_API_BASE_URL`.
- When `VITE_API_BASE_URL` is **empty**, the staff UI uses `src/services/demoStaff.js` only.
- When `VITE_API_BASE_URL` is set, staff uses API session login + endpoints, not demo one-click login.
- `src/StaffApp.jsx` presents the UI; `src/AdminApp.jsx` and `src/SuperAdminApp.jsx` pass distinct roles.
- Use `BACKEND_HANDOFF_V46.md` and `backend-handoff/openapi.yaml` as starting points; synchronize API schemas for any added features.
- **NEVER enforce roles only in React or localStorage.** Require server-side authentication, RBAC and audit, server-side validation, session protection, and HTTPS before production.
- Never trust browser-listed price, stock or payment flags. Backend must calculate checkout totals, check stock atomically, and confirm payment via trusted provider callbacks.

## Current limitations

- All demo staff edits are local only. Telegram replies are **not** transmitted. Payment status edits do **not** verify bank payment.
- Published product photos may use third-party URLs that can fail or require re-hosting permission.
- This archive has been checked with Node unit tests and JSX/CSS parsers. A complete Vite production build was not run in the artifact-generation environment (npm dependencies were unavailable there). Please run `npm.cmd run build` locally before sharing the deployment.
