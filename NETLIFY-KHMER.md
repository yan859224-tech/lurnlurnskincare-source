# LUMI SKINCARE V4 – Netlify demo deployment

## Fastest reliable way: build then upload `dist/`

1. Extract this ZIP and open the inner `lumi-skin` directory in VS Code (the one with package.json).
2. VS Code Terminal (PowerShell):

   npm.cmd install
   npm.cmd run build

3. Confirm `lumi-skin/dist/index.html` exists.
4. Sign in to https://app.netlify.com/drop
5. Drag **only the `dist` folder** into the upload area (not `src`, not `node_modules`, not the ZIP).
6. Wait for a successful publish and copy the actual HTTPS `*.netlify.app` site URL. Open it in private/incognito mode before sharing.

## Alternative: deploy from GitHub

- Connect the repository at https://app.netlify.com/start .
- If GitHub repository root has `package.json`, use base directory blank, build command `npm run build`, publish `dist`.
- If GitHub repository root contains the nested `lumi-skin` folder, choose base directory `lumi-skin` and publish `dist` relative to base.
- Netlify will rebuild the site after successful Git pushes.

## React routes / 404

`public/_redirects` is copied by Vite into `dist/_redirects`. This rewrites unknown client-side paths to `/index.html` so reloading /shop or /payment works. A matching `netlify.toml` is included for Git deploys.

## Important demo restrictions

- Without configured Supabase Auth, login/register uses a local browser demo identity, NOT real authentication.
- Cart, addresses and orders are stored in each browser's localStorage. Your friend's orders will not appear in your browser or a shared database.
- No actual ABA/KHQR/Visa payments are processed; all payments are demo/pending and COD is not sent to a courier.
- The demo admin route is not secured. Do not enter real customers' names, addresses, payment details or other sensitive data.
- Product/pricing and shipping data are examples, not a verified live shop.

## Testing checklist

- Mobile: 375 / 390 / 430px: menu, shop, filters, quiz, cart, address, checkout, payment, back, refresh.
- iPad: 768 / 820 / 1024px: layout, table widths, navigation, touch controls.
- Computer: 1280 / 1440px: banners, filters, forms, checkout and keyboard navigation.
- Test English/Khmer, light/dark, USD/KHR, promo, COD demo and navigation reloads.
- Ask testers to send screenshots, exact page and device when reporting bugs.
