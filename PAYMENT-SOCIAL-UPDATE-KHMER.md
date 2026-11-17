# LUMI SKINCARE V4 — Payment & Social Update

## Added
- ABA/KHQR and KHQR open a mobile-friendly modal using the image supplied by the shop owner. The QR has been permanently obscured in the shipped asset to prevent real payments during public testing.
- Recipient name: BAN BUNYAN (as shown in the supplied ACLEDA screenshot).
- Displays calculated cart total separately: **not encoded into the static QR**.
- Visa / bank card opens a Google Play-inspired, **visual-only** card form. Card inputs are disabled, never captured or saved. Real implementation requires an approved hosted payment gateway and server-side verification.
- Social links in footer: Telegram + Instagram + Facebook. Only real configured profile URLs are clickable.

## Configure Instagram / Facebook
Create a `.env` file inside `lumi-skin` project root:

```
VITE_INSTAGRAM_URL=https://www.instagram.com/YOUR_REAL_HANDLE/
VITE_FACEBOOK_URL=https://www.facebook.com/YOUR_REAL_PAGE/
```

Replace placeholders with actual public profile links, then restart `npm.cmd run dev` or rebuild for Netlify. Do not add private API keys to Vite environment variables.

## Install and run (PowerShell)
```
npm.cmd install
npm.cmd run dev
```
Build for Netlify drag-and-drop:
```
npm.cmd run build
```
Upload the generated **dist** folder to https://app.netlify.com/drop. This does **not** automatically update a previously deployed site; upload a new build.

## IMPORTANT
- Online payments are disabled. No QR is linked to an invoice, and **no payment is ever verified**.
- For production, use a real Cambodian KHQR merchant/payment-provider integration with dynamically generated transaction amounts, webhooks and server-side verification.
- Never put a real card capture form into client-only React state or localStorage; use hosted provider SDK/checkout.
- Demo orders remain **unpaid/pending** for online methods.
