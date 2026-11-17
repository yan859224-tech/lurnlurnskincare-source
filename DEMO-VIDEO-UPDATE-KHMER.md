# LurnLurn Skincare — Video Reference Demo Update

## New features
- Floating support chat styled after the user-submitted video, with Khmer/English quick replies, basic product matching, and optional Telegram handoff configured in Admin.
- 16 additional product names collected from the provided video; not claims of official stock or price.
- Demo product artwork stored in `public/images/video-demo/` as illustrative SVG; does not reproduce actual product packaging.
- Shop search/filter includes the additions; added home section "As seen in your video".
- Preserved existing About Us navigation (which the owner previously chose instead of a quiz).

## Test flow
1. `npm.cmd install`
2. `npm.cmd run dev`
3. Open the floating **Chat?** button; tap a suggested topic or search for "AESTURA" or "acne".
4. View recommended products and open a product.
5. Open `/shop`, try search and filter; open About Us.
6. Configure Telegram username in Admin settings; tap **Continue on Telegram** in chat.
7. `npm.cmd run build`; upload only `dist/` to Netlify.

## Limits
- Chatbot is a deterministic local assistant with suggestions, NOT a hosted AI chatbot or a message inbox.
- Product prices, sizes, stock and artwork for video additions are illustrative.
- Secure login, cross-device order sync and real payments require a backend and payment provider.
