# LurnLurn Skincare V4.8 — Backend Handoff / API Contract

## Goal

Preserve the V4.7 dashboard design, with more polished graph/counter/page motion, while **prohibiting admin access until the backend provisions a real username/email + password + role**. This ZIP contains *frontend only* and never contains a valid staff password.

## Entry points (multi-page Vite build)

| Page | Entry | Access |
|---|---|---|
| `/` | `index.html` / customer app | Storefront, some flows still demo until connected |
| `/admin.html` | `src/admin-main.jsx` -> `AdminApp` -> `StaffApp` | Only backend-verified `role: "admin"` |
| `/super-admin.html` | `src/super-admin-main.jsx` -> `SuperAdminApp` -> `StaffApp` | Only backend-verified `role: "super_admin"` |

`VITE_API_BASE_URL` is **required** to enable staff login, for example `http://localhost:3000/api` locally or `https://api.yourdomain.com/api` for production. Set it in `.env.local`, rebuild/restart Vite and NEVER put passwords, database keys, private tokens or service role keys in `VITE_` environment variables.

## Authentication contract (backend must implement)

1. `POST /auth/login` with `{"email":"...","password":"..."}` — validate password hash and account status; set a secure server-managed `HttpOnly`, `Secure`, `SameSite` session cookie (appropriate SameSite policy if cross-origin). Rate limit login and prevent brute force.
2. `GET /auth/me` returns `{"user":{"id":"...","name":"...","email":"...","role":"admin"}}` (or `"super_admin"`) **based on the server session/DB**, never a role supplied by the browser. Return HTTP 401 if not authenticated.
3. Frontend calls `/auth/me` after login and at every page reload. No localStorage/sessionStorage staff privileges are accepted.
4. `POST /auth/logout` revokes the current session and clears the session cookie.
5. For **every** `/admin/*` request, validate session, active account status and required role; return 401 or 403 as appropriate. Roles are separate: `admin` cannot use Super Admin routes. To allow Super Admin to open the Admin dashboard too, change role contract and verify it server-side; current UI keeps workspaces separate.
6. Configure CORS with the exact storefront origin and `credentials: true` if API is on a different origin; implement CSRF defenses for cookie-authenticated POST/PATCH/DELETE (server-side Origin/Referer verification plus CSRF token/double-submit as appropriate). Never use wildcard allow-origin with credentials.
7. Never allow browser clients to set `paymentStatus: paid` or claim a card/KHQR payment was completed. Payment updates must come from independently verified gateway notifications.

## Dashboard/analytics endpoint

`GET /admin/overview?range=7d` or `?range=30d`

Example **response format only** (numbers below are illustrative schema examples, not data supplied by this project):

```json
{
  "metrics": {
    "products": 39,
    "orders": 14,
    "revenue": 138.50,
    "conversations": 3,
    "lowStock": 6,
    "pendingOrders": 4,
    "activePromotions": 2
  },
  "series": [
    {"label": "Mon", "revenue": 15.50},
    {"label": "Tue", "revenue": 32.00},
    {"label": "Wed", "revenue": 9.00}
  ],
  "recentOrders": [
    {"id": "ORD-1001", "createdAt": "2026-11-16T10:30:00Z", "customer": {"name": "Sample"}, "totals": {"total": 22.50}, "status": "processing"}
  ],
  "updatedAt": "2026-11-17T04:00:00Z"
}
```

- The `revenue` KPI and chart points must only include **server-verified paid revenue** in USD and must be based on a defined, consistent timezone/date range.
- All metrics must be server-owned numeric values (not strings). An absent metric becomes `—`; absent chart series is a deliberate empty state, **not fabricated numbers**.
- Chart range buttons fetch new data from the backend on demand.
- If backend returns an envelope `{"data":{...}}`, the frontend also accepts it.

## Resource endpoints

All list responses: `{ "items": [ ... ] }` (also supports `{ "data": { "items": [ ... ] } }`).

| Method | Route | Allowed roles | UI |
|---|---|---|---|
| GET | `/admin/products` | admin, super_admin | Table/search/stock filters |
| POST | `/admin/products` | admin, super_admin | Add product (server validates price, stock, image URL) |
| PATCH | `/admin/products/:id` | admin, super_admin | Edit visibility/stock/price |
| GET | `/admin/orders` | admin, super_admin | Order list |
| PATCH | `/admin/orders/:id` | admin, super_admin | **Only fulfillment `status` from this UI** |
| GET | `/admin/conversations` | admin, super_admin | Conversation list |
| PATCH | `/admin/conversations/:id` | admin, super_admin | Status update |
| POST | `/admin/conversations/:id/replies` | admin, super_admin | Sends real server-side reply; integrate Telegram on server if needed |
| GET/POST | `/admin/promotions` | admin, super_admin | Promo campaigns |
| PATCH/DELETE | `/admin/promotions/:id` | admin, super_admin | Edit/archive promotion |
| GET | `/admin/team` | super_admin | Staff list |
| POST | `/admin/team/invitations` | super_admin | Invite staff; backend securely provisions password/role |
| PATCH | `/admin/team/:id` | super_admin | Update role/status with server-side constraints |
| GET | `/admin/settings` | super_admin | Settings list |
| PATCH | `/admin/settings/:id` | super_admin | Store settings |
| GET | `/admin/audit` | super_admin | Read-only audit log |

- `orders` fields: `id`, `customer.name`, `createdAt`, `totals.total`, `paymentStatus`, `status`. Backend calculates monetary totals.
- `products` fields: `id`, `brand`, `name`, `category`, `size`, `image`, `price`, `stock`, `active`.
- `promotions` fields: `id`, `promoType`, `promoLabel`, `promoLine`, `productId`, `discountPercent`, `priority`, `active`.
- `conversations` fields: `id`, `name`, `subject`, `channel`, `status`, `messages: [{from,text,at}]`.
- `team`: `id`, `name`, `email`, `role`, `status`. Only backend invitation mechanism issues credentials, never the frontend.
- `audit`: `id`, `at`, `actor`, `action`, `section`, `target`.
- For deletes, consider archive instead of hard deletion; return appropriate HTTP response and audit event.

## Source code navigation

- `src/StaffApp.jsx` — authenticated staff UI, forms, table, permission checks.
- `src/StaffOverview.jsx` — animated KPI counter, line chart, real-data empty states and range selection.
- `src/services/staffApi.js` — all staff HTTP integrations; replace paths here if backend contract differs.
- `src/services/staffContracts.js` — pure role and analytics/CSV helpers.
- `src/staff.css` — base V4.7 design + V4.8 responsive motion.
- `src/App.jsx` — customer storefront. **Customer demo/localStorage remains separate from real staff API; full e-commerce backend integration is not finished by this update.**

## Notes for production

- Backend should use database transactions and stock reservations/consistency checks for real orders.
- Sensitive fields and authorization checks must never depend solely on frontend navigation.
- Role changes must invalidate sessions or be evaluated on every request.
- `CORS`, `cookie Secure/SameSite` and `CSRF` settings differ depending on whether API shares the same site; have the backend team verify the deployment origin.
- Images for catalog are still externally hosted. Use licensed local storage for actual production.
- The Admin dashboard shows no fabricated analytics when backend is offline; login remains locked without configured API.
