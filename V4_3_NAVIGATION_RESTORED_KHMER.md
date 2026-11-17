# LUMI SKINCARE V4.3 — Header Navigation Restoration

## ការកែថ្មី

- **Desktop (> 1390 CSS px):** Home / Shop all / Filters / Skin concerns / Skin quiz / Promotions / Contact បង្ហាញជាបន្ទាត់ជាមួយ Logo។
- **Small desktop / iPad (761–1390 CSS px):** Logo និង User Controls នៅបន្ទាត់លើ, Navigation ទាំង 7 នៅបន្ទាត់ទីពីរ។ មិនលាក់ Menu ទាំងមូលទៀតទេ។
- **Mobile (≤ 760 CSS px):** Logo, Cart, Hamburger។ ចុច Hamburger នឹងឃើញ Home, Shop all, Filters, Skin concerns, Skin quiz, Promotions និង Contact។
- **Filters:** មាន icon SlidersHorizontal។ Desktop ចុចបើក Category Dropdown។ Mobile ចុច Filters ទៅ /shop?filters=1 ដែលបើក Filter Sheet។
- បានរក្សា V4.2 Product Hero Cutouts, Cart, Checkout, Payment Previews និង Language/Currency/Theme Settings។

## Run

```powershell
npm.cmd install
npm.cmd run dev
```

## Netlify

```powershell
npm.cmd run build
```

Upload Folder `dist` ទៅ Netlify Deploys។

> Development Demo: Login/Orders មិនមែន Production-ready និងការទូទាត់មិនបាន verify ពិតទេ។
