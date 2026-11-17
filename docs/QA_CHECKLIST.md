# Manual QA checklist — test after `npm.cmd install` and `npm.cmd run dev`

### Screens
- [ ] Homepage cinematic hero loads with product images.
- [ ] Best-seller slider advances about every 3 seconds and can be paused.
- [ ] Brand/logo and product galleries scroll continuously; reduced-motion setting stops distracting animation.
- [ ] Shop All search, category dropdown, brand filter and sorting work.
- [ ] Product benefits and official source links match the displayed product.
- [ ] Promotions page, GLOW10 coupon, wishlist and skin quiz work.
- [ ] Khmer / English, Light / Dark and USD / KHR toggles persist after reload.

### Checkout
- [ ] Guest can add to cart but Checkout sends them to demo login or secure Supabase login.
- [ ] After login, the original bag is preserved and checkout resumes.
- [ ] Cart quantity update and remove work; order total updates.
- [ ] Address creation validates name, phone, district and street; can select saved addresses.
- [ ] Courier selection changes sample shipping fee (J&T, PP Delivery, VET, ZTO).
- [ ] Notes, quantity and coupon appear in the invoice.
- [ ] COD creates a browser-local NOT PAID order; online methods clearly state PENDING/UNPAID.
- [ ] No Visa card data or fake payment QR is requested or generated.
- [ ] Confirmation shows order ID, and account history shows the same order.

### Browser / responsiveness
- [ ] 375 and 430px phone views: navigation, filters drawer, cards and forms all usable.
- [ ] 768 and 1024px tablet: filters, delivery and invoice usable.
- [ ] 1280 and 1440px desktop layout good.
- [ ] Browser back/forward works on routes.
- [ ] Keyboard tab and focus rings visible.
- [ ] No horizontal overflow or obscured fixed buttons.
- [ ] `npm.cmd run build` completes without error.
- [ ] `node --test tests/*.test.js` passes (pricing calculations).

**QA limits:** npm dependencies could not be downloaded into the authoring environment. Source syntax and CSS parsing were checked, but live browser and production build verification still need to run on a machine with npm access.
