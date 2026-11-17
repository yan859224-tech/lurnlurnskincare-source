# LurnLurn Skincare – Backend Handoff (V4.6)

## Frontends / entrypoints
- Public storefront: `index.html` → `src/main.jsx` → `src/App.jsx`
- Admin: `admin.html` → `src/admin-main.jsx` → `src/AdminApp.jsx` → `src/StaffApp.jsx` (role `admin`)
- Super Admin: `super-admin.html` → `src/super-admin-main.jsx` → `src/SuperAdminApp.jsx` → `src/StaffApp.jsx` (role `super_admin`)
- Common API client: `src/services/api.js` using `VITE_API_BASE_URL`. No hardcoded secrets.

## Required API contract (expected by existing UI)
All paths below relative to `VITE_API_BASE_URL` and HTTPS in production.
| method | route | response / request |
|---|---|---|
| GET | `/auth/me` | `{user: {id,email,name,role}}` |
| POST | `/auth/login` | body `{email,password}`, response `{user}`; sets secure HttpOnly session cookie |
| POST | `/auth/register` | body `{name,email,password}`, response `{user}` |
| POST | `/auth/logout` | clears session |
| GET | `/admin/products` | `{items:[{id,name,brand,price,stock,active,image}]}` for staff only |
| PATCH | `/admin/products/:id` | updates product record, server-side validation and audit logging |
| GET | `/admin/orders` | `{items:[]}`, staff only |
| GET | `/admin/conversations` | `{items:[]}`, staff only |
| GET | `/admin/promotions` | `{items:[]}`, staff only |
| PATCH | `/admin/promotions/:id` | adjusts type, creative, schedule, product, priority |
| GET | `/admin/team` | `{items:[]}`, super_admin only |
| GET | `/admin/settings` | `{items:[]}`, super_admin only |
| GET | `/admin/audit` | `{items:[]}`, super_admin only |
| POST | `/conversations/messages` | body `{channel:'telegram',message,source:'store-chat'}`, request from store chat; must validate/rate limit and relay via server |

For production the backend MUST enforce role-based authorization on every route, NOT by email, UI state, or localStorage. Super Admin must not be created simply by naming/email match. Add CSRF protection as appropriate for cross-origin cookie auth, strict allowed origins, and audit logging on mutations. Apply anti-spam, bot throttling and explicit privacy consent for Telegram relay. Store `TELEGRAM_BOT_TOKEN` and `TELEGRAM_STORE_CHAT_ID` only on backend. Never expose in VITE_ variables.

## Product shape
`{id,sku,brand,name,category,size,price,old,image,source,stock,active,benefits,concerns,tag}`. Stock is integer >=0; 0 means Out of stock; price uses USD in prototype; do not trust client price at order placement. Server must validate stock atomically at checkout and compute totals itself.

## Promotion shape
`{id,promoType,promoLabel,promoLine,productId,discountPercent,startsAt,endsAt,active,priority,image}`. `promoType` is discount|bestseller|trending|promotion. The existing 3-second carousel uses mock `src/promotions.js` and should load active approved campaigns from server in production. Bestseller/Trending should be driven by verifiable metrics or clearly labeled curation.

## Photos
- Real retail product-photo URLs and source references are in `src/real-product-photos.js`.
- Images are external and may fail to hotlink. This is for prototype only; obtain photo usage permission and rehost authorized product images (ideally AVIF/WebP + fallback) before production.
- Stock, price, discount and trend status in V4.6 are DEMO, not seller inventory or verified sales.

## Telegram workflow
- Direct contact `VITE_TELEGRAM_USERNAME=STORE_USERNAME` produces `https://t.me/STORE_USERNAME` link without a backend.
- To send chat messages automatically into store Telegram, implement `POST /conversations/messages` on your backend; example outbound relay in `backend-handoff/telegram-relay.mjs`.
- Customer explicit click is required before sending. Do not place BOT TOKEN in frontend.
- No live Telegram support exists until merchant username/bot is configured.

## Khmer font
Prototype uses Kantumruy Pro for Khmer UI (Google Fonts), with Noto Sans Khmer fallback. Exact font in the reference video could not be verified precisely.

## Validation
Run `npm.cmd install`, `npm.cmd run build`, `npm.cmd test` (Windows), then check manually on 375px, 430px, 768px, 1024px, 1440px. Test stock=0, photo fallback, promo rotation pause, and chatbot handoff. Browser/localStorage demo orders are NOT shared across devices.
