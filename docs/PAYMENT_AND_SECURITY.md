# Payment, delivery and order integrity roadmap

## Frontend state machine now implemented (demo)

`guest browsing → cart → auth gate → address selection/creation → courier + note → pro-forma invoice → method selection → demo order history`

At the final step, all methods create only a browser-local order:

- COD: `cod-not-paid` — **no courier was booked**.
- ABA KHQR / KHQR / Visa: `pending` — **no money collected**, no real payment verified.

Sample delivery fees: J&T $2.50, PP Delivery $1.50, VET $2.00, ZTO $3.00. These are **not real provider quotations**. Verify service area, pricing, timetable and availability before launch.

## Production architecture

- Auth: Supabase Auth or another secure identity provider.
- Data: `products`, `product_variants`, `stock`, `orders`, `order_items`, `addresses`, `promotions`, `payment_attempts` with row-level security and verified roles.
- API: server-side create-order transaction that recalculates prices and discounts from database, verifies stock, rate limits abuse, and prevents duplicate submissions.
- Delivery: seller chooses supported courier(s); integrate shipping quotations or admin-set verified price rules.
- Payment: PayWay e-commerce Checkout for ABA/KhQR/Visa or a licensed equivalent. Generate payment transactions with server-held merchant secrets. Never collect raw Visa card data in React; redirect or use hosted secure payment fields.
- Confirmation: signed PayWay callback/webhook plus server-side transaction status verification; store idempotent payment state and only mark `PAID` on confirmed success.
- Logistics: book shipment only after the order becomes valid under store rules; generate tracking updates.

ABA documentation: https://developer.payway.com.kh/folder-3158159 and https://developer.payway.com.kh/folder-3158158

## Additional security work

Rate limiting, CSRF/session protections where relevant, audit logging, refund policies, privacy notice, address retention/deletion policy, verified inventory, HTTPS, seller-only role-protected administration, and test suite for concurrency and duplicate payments.
