# LUMI V4.1 — Fixes / ការកែសម្រួល

1. Hero: blend background of floating product cards into hero canvas. This works best with solid white-background product photos; for perfect cutouts, replace product images in `src/data.js` with licensed transparent PNG/WebP files.
2. Favorites and Add to Cart: guest tap now routes to Login/Register and remembers the requested action. After login the selected item is added to wishlist or cart automatically. Signing out clears the browser wishlist for this demo session.
3. Checkout + Payment: breakpoints include tablet widths, fluid invoice table scroll, safe-area spacing for iPhone, and full-width checkout panels. No more desktop sidebar squeeze on tablets.
4. Payment remains a demo: a real scannable owner-supplied QR exists, but orders are never marked paid automatically. Never enter genuine payment card information.

## Test on devices
- iPhone 375px, 390px, 430px; iPad portrait 768px, landscape 1024px; desktop 1440px.
- Test Shop > Heart while logged out > Sign in > Wishlist.
- Test Cart > Checkout > Create address > Delivery > Payment. Scroll to bottom in mobile Safari and Chrome.
- On Netlify rebuild with `npm.cmd install`, `npm.cmd run build` and upload `dist`.

## Known limitation
When Supabase is not configured, demo user/wishlist/orders are stored in a single browser's localStorage, not a real shared account or secure backend. The hero image blending hides white backgrounds in many browsers but a real transparent image asset is needed for guaranteed clean edges.
