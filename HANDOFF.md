# LurnLurnskincare — integration draft

This is an incremental frontend handoff, NOT a production-ready or bug-free release. The existing Netlify deployment was not changed.

## Run
Node.js 22+, npm ci, npm run dev. npm run build creates dist. npm test runs 10 inherited unit/source tests. Open /, /admin.html, /super-admin.html. All three are independent entry points in the same repository, not yet independent deployment projects. Keep shared chunks when deploying dist.

## Changes
Uploaded logo retained unchanged and displayed through a CSS crop. Brand/navigation updated; Category supports pointer hover, click and Escape. Khmer uses Noto Sans Khmer with system fallback. Guest cart permitted; quantity updates constrained by catalog stock. Shop has maximum USD budget filter. Human consultation replaces quiz navigation. Catalog has 23 real product names; prices/stock are illustrative. 11 new records have explicit pending-photo artwork, not actual product photographs. Promotion carousel uses editorial bestseller/trending picks, not verified sales rankings.

## Backend connection
Set VITE_API_BASE_URL to the API origin/path. src/services/api.js is the shared fetch boundary. Requests include cookies. Backend must validate sessions, roles and every input; implement exact-origin credentialed CORS, CSRF protections, HttpOnly Secure session cookies, rate limiting and OAuth callback verification. Never put provider secrets in VITE variables.

Responses below are JSON. Error: {"error":{"message":"Safe user-facing message"}} with appropriate non-2xx status.

| Method | Path | Request / response |
|---|---|---|
| GET | /auth/me | {user:{id,name,email,role}}; 401 if signed out |
| POST | /auth/login | {email,password} -> {user} + session cookie |
| POST | /auth/register | {name,email,password} -> {user}; implementation currently expects an immediate session; add verification-required UI if registration needs email confirmation |
| POST | /auth/logout | revoke session, return {} |
| GET | /auth/facebook/start | backend redirects to Facebook; callback establishes session then redirects to storefront |
| GET | /auth/telegram/start | backend owns Telegram sign-in flow and verification; redirect after success |
| GET | /conversations | authenticated customer's {messages:[{id,text,senderRole}]} |
| POST | /conversations/messages | {text,clientMessageId} -> {message:{id,text,senderRole}}; deduplicate clientMessageId |
| GET | /admin/:resource | {items:[{id,...fields}]} |
| PATCH | /admin/:resource/:id | validated editable fields -> updated record |

Admin resources: overview, products, orders, conversations, promotions. Super Admin adds team, settings, audit. Backend must independently deny ordinary admins those resources. Audit is read-only in the UI. Staff screens currently use generic record cards and JSON editing for integration testing, not finished business forms. Only PATCH exists; create/archive workflows remain to implement. UI role gates are convenience only.

## Important unfinished work
- Products, addresses, orders, coupons and checkout still use inherited browser-local logic. API auth does NOT make checkout production-ready. Implement authoritative catalog fetching, quote, inventory reservation, idempotent order creation and payment verification before release.
- Demo auth accepts a test identity; passwords are not stored or verified in demo mode. Do not use real credentials in demo. Remove demo account paths for production.
- Authentication pending-cart continuation and redirects need integration tests. Secure API user roles are not yet connected to the inherited storefront admin badge; use dedicated staff entry points.
- Chat sends to the server and refreshes replies manually; no live polling/WebSocket, attachments or finished staff reply composer yet.
- Staff app requires a real backend to render records; no fake success is shown on network failure.
- Brand text and Khmer translation still require full content audit; font download depends on Google Fonts availability.
- Contact, policies, actual business details, product images and real inventory need owner-supplied content.
- Fully independent deployable storefront/admin/super-admin packages, typed API DTOs/OpenAPI schema and comprehensive integration tests remain to complete.
- No mobile/tablet browser QA, accessibility audit, payment integration or security audit has been completed for this revision.

## Catalog provenance
Existing 12 records retained. Added names checked against https://www.cosrx.com/products/low-ph-good-morning-gel-cleanser and https://beautyofjoseon.com/collections/all-skin-care and https://beautyofjoseon.com/collections/serum . Manufacturer packaging remains authoritative; sample prices do not represent Cambodia store quotes.

## Validation performed
Vite production build passed for all 3 entry points. 10 existing tests passed after quiz destination expectation changed to chat. These cover inherited pricing/admin helpers and navigation source assertions, not comprehensive end-to-end behavior.

## Revision: About Us, Telegram and brand
Navigation now opens /about (English/Khmer). Header and footer use one shared Brand component: gold uploaded mark plus LURNLURN / SKINCARE. Floating Telegram launcher is always visible. Configure VITE_TELEGRAM_USERNAME with the real public advisor username (without @), then rebuild. Existing local store setting lumi_v4_telegram can override the environment setting; remove that key if it is stale. When configured, clicking opens https://t.me/USERNAME in a new tab, matching the reference behavior. Without a username, the launcher displays an honest unavailable notice; no fake username is used. This is a Telegram contact link, not an autonomous chatbot. Old /quiz and /chat routes open About Us. Existing integration-draft limitations above remain.
