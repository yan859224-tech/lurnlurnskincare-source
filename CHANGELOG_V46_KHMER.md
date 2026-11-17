# LurnLurn Skincare V4.6 – Changes

- Replaced previous 27 illustrated / placeholder product image references with matching product photographs hosted by third-party sites (internet required, use with permission).
- Catalog has 39 unique named SKUs, with image references for all 39. Not 39 live verified seller listings.
- In Stock / Out of Stock labels on product cards, details, editorial galleries, and carts. Demo 0-stock SKUs: IDs 23, 106, 112. Add-to-cart and Buy Now disabled for 0-stock.
- Checkout stock validation checks current in-browser catalog before order placement; final server-side atomic stock validation is required in production.
- Added 3-second featured editorial slider with Discount, Bestseller Pick, Trending Pick, Featured Collection. All these labels are curatorial / demo, not actual verified sales metrics.
- Chatbot includes Telegram direct-link handoff when a store username is configured. Optional explicit send-to-store action requires real backend `/conversations/messages` and secure Telegram Bot integration.
- Khmer prototype font changed to Kantumruy Pro (approximate visual choice), Noto Sans Khmer fallback.
- Separate storefront `index.html`, admin `admin.html` and super admin `super-admin.html` compiled via multi-page Vite configuration; separate React entry wrappers for StaffApp.
- Documented REST contract, OpenAPI and backend Telegram relay sample in `backend-handoff/`.
- Preserved previous features and Netlify settings.

## Limits
No secure production account, real-time inventory sync, automatic Telegram delivery, payments, or server-side orders is active without a backend. Stock, prices and promotions are demo examples. Third-party image hotlinks can block or change; request licensing and host permitted copies before a public commercial launch. Exact font from reference video could not be independently identified.
