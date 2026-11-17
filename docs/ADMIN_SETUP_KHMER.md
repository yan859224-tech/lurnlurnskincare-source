# LUMI SKINCARE V4.4 — Admin Dashboard Setup (Khmer)

## Admin identity
- Display name: **Admin**
- Email: **bunyanban20@gmail.com**
- Dashboard path: **/admin** (older **/demo-admin** also routes here).

## A) Fast local UI preview — NOT SECURE
1. Run `npm.cmd install` and `npm.cmd run dev` in the `lumi-skin` folder.
2. Go to `/auth` or click Account → Sign in.
3. In browser-only Demo Mode, enter **Name: Admin** and **Email: bunyanban20@gmail.com**.
4. You will land on `/admin`. Product/stock edits, Telegram settings, and test order list are **local browser data only**. Anyone can enter those values; this IS NOT secure authentication and grants no database permissions.
5. Do **not** use demo identity for real customers, payments, or private data.

## B) Secure Admin login on Netlify with Supabase Auth
1. Create a project at https://supabase.com/ and enable Email authentication.
2. In the project root create `.env` locally:
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
   ```
   Do NOT include a Supabase service_role/secret key in `.env`, frontend code or Netlify public variables.
3. Sign up as **Admin**, using **bunyanban20@gmail.com**, with a private strong password. Confirm the email if prompted.
4. In the Supabase SQL Editor, run `supabase/admin_setup.sql`. It creates RLS-protected admin role and store settings/override tables and grants the role to your **confirmed** registered Supabase user ID. Check that the final INSERT affected one user; if not, confirm email first then rerun the INSERT.
5. Restart Vite or on Netlify set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Environment variables, then redeploy.
6. Sign in. The app checks the `admin_users` table. Only a verified admin account can access `/admin` and modify data in Supabase. Database RLS protects writes even if someone tampers with browser JavaScript.

### What works today
- Admin Overview (product counts, local test orders, demo chart).
- Manage product **price**, **demo stock**, **active/hidden**. If Supabase is configured, these product overrides are stored in `store_product_overrides` and visible to visitors (catalog visibility may require future filtering in custom listings).
- Telegram public store contact settings (Supabase persisted or local demo).
- Review **orders saved on the CURRENT browser only**.

### Not production ready
- Buyer checkout and orders still use browser localStorage; admins CANNOT see other users' orders, even in secure mode. Do not rely on this for operations.
- Payment QR remains static; Visa remains a demo; no verified payments.
- Product images use external sources and demo pricing. No inventory enforcement at checkout.
- A production store requires an orders table with server-side payment validation, policies, inventory checks, and delivery integrations.

## Deploy/update Netlify
Open inner `lumi-skin` folder in VS Code. Run:
```
npm.cmd install
npm.cmd run build
```
Upload **dist/** to your existing Netlify site, or connect GitHub for automatic deploys. If using Supabase set environment variables on Netlify **before** building on the platform. If you build locally, set .env in local project before npm run build. `netlify.toml` includes SPA redirects for /admin and other pages.
