# LUMI SKINCARE V4.2 — Complete Source Update

## Changed
- Replaced hero SKIN1004 and Dr. Althea images with background-free WEBP illustrations. They are *AI-generated editorial mockups*, not authentic manufacturer photography or reliable product-label reproductions; the original catalog pictures remain unchanged.
- Kept Round Lab hero photo, the floating effects, the infinite marquees, all customer pages, cart, and payment prototypes.
- Mobile header now displays the full wordmark. Language, currency, and theme settings are available inside the mobile menu. Desktop controls stay in the desktop header.
- Source has Netlify SPA routing support and `.gitignore`.

## Run locally
Open the inner `lumi-skin` directory, the one containing `package.json`.

```powershell
npm.cmd install
npm.cmd run dev
```

## Deploy to Netlify
```powershell
npm.cmd run build
```
Upload the resulting `dist` directory to Netlify Drop or your existing project's Deploys page.

## Important
- UI is for demonstration. Never enter a real payment card or its CVV in the demo.
- A static KHQR image may be scannable but payment status is not verified by a provider.
- Real product-image use in a commercial site requires appropriate rights and validation.
- Mobile viewport QA recommended: 320, 360, 375, 390, 414, 430px and iPad 768/1024px.
