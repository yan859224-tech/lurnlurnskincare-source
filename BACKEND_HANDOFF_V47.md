# LurnLurn Skincare V4.7 — Frontend / API Handoff

## Three separate frontend entrypoints

| Page | React entry | Role |
|---|---|---|
| `/` | `src/main.jsx` -> `src/App.jsx` | Public/customer |
| `/admin.html` | `src/admin-main.jsx` -> `src/AdminApp.jsx` -> `src/StaffApp.jsx` | admin |
| `/super-admin.html` | `src/super-admin-main.jsx` -> `src/SuperAdminApp.jsx` -> `src/StaffApp.jsx` | super_admin |

## Demo vs backend mode

`src/StaffApp.jsx` uses `src/services/demoStaff.js` when `VITE_API_BASE_URL` is unset. This localStorage implementation provides the exact UI states for pre-integration tests, not secure authentication. It includes sample products, orders, promotions, conversations, team, settings and audit events.

When `VITE_API_BASE_URL` is set, `src/services/api.js` handles HTTP requests. Session is expected to be an HttpOnly secure cookie (CSRF controls may be required if cross-origin). `GET /auth/me` should return `{user:{id,name,email,role}}`. The user can be a regular customer; the UI must block users without a matching role, and the backend **must also enforce** every action.

## API endpoints to implement / confirm

| Verb | Path | Role | Notes |
|---|---|---|---|
| GET | `/auth/me` | signed in | `user` with server-trusted `role` |
| POST | `/auth/login` | anonymous | `{email,password}`; rate limit |
| POST | `/auth/logout` | signed in | Clear session |
| GET | `/admin/products` | admin+ | `items` array |
| POST | `/admin/products` | admin+ | New item; validate price/stock |
| PATCH | `/admin/products/:id` | admin+ | Supports `price`, `stock`, `active`, metadata |
| GET | `/admin/orders` | admin+ | Server-owned totals and statuses |
| PATCH | `/admin/orders/:id` | admin+ | Fulfillment status only unless payment is separately verified |
| GET | `/admin/conversations` | admin+ | Conversations |
| PATCH | `/admin/conversations/:id` | admin+ | Mark resolved or add a **server validated** reply |
| GET | `/admin/promotions` | admin+ | Promotions |
| POST | `/admin/promotions` | admin+ | Campaign creation |
| PATCH | `/admin/promotions/:id` | admin+ | Approval, schedule, priority |
| DELETE | `/admin/promotions/:id` | admin+ | Archive rather than hard delete if required |
| GET | `/admin/team` | super_admin | Team list |
| PATCH | `/admin/team/:id` | super_admin | Server-verified role assignment |
| GET | `/admin/settings` | super_admin | Store settings |
| PATCH | `/admin/settings/:id` | super_admin | Validated settings |
| GET | `/admin/audit` | super_admin | Immutable audit history |

Frontend assumes list responses `{items:[...]}`. Update the API bridge and schemas with backend engineers before live integration. Existing `backend-handoff/openapi.yaml` is a V4.6 draft and may lack new POST/DELETE endpoints.

## Storefront demo handoff keys (same-origin browser only)

- `lumi_v4_inventory_overrides`: product overrides; set `stock:0` to display Out of Stock.
- `lurn_demo_added_products`: browser-local newly-created product records.
- `lurn_demo_staff_promotions`: active campaigns used by `makePromotions(catalog,campaigns)` and the 3-second carousel.
- `lumi_v4_orders`: customer browser-only demo orders (staff list also includes sample orders).
- `lurn_demo_order_overrides`: staff order status changes (browser-only).
- `lurn_demo_staff_conversations`, `lurn_demo_staff_team`, `lurn_demo_staff_settings`, `lurn_demo_staff_audit`: samples.

Replace these storage keys with server API data in production. Do not rely on localStorage for orders, payments, stock or permissions. Inventory and payment validation must be server-side.

## Security and behavior

- Do not ship `VITE_ENABLE_DEMO_STAFF` as a real privilege mechanism; there is no such real protection in the demo.
- Never put backend/admin service keys or Telegram Bot tokens in a Vite frontend env var; all `VITE_` values are public.
- Payment status = paid must be based on verified gateway callbacks or bank settlement, not editable by a browser user.
- Scrub sample customer names/emails when using the live deployment for testing.
- Role-driven navigation is **only** a UX aid. Deny unauthorized backend resources regardless of UI state.
