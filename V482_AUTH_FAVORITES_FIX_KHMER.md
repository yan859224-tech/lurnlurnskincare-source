# LurnLurn Skincare V4.8.2 — Login-gated Bag & Favorites

## ការកែសម្រួល

- **Guest ចុច Heart**៖ ទៅ Login / Register; រក្សាទុក Product ដែលបានចុច; ក្រោយ Login ជោគជ័យ នឹង Save Favorites ហើយបើក `/wishlist`។
- **Guest ចុច Add to Bag**៖ ទៅ Login / Register; *មិនបន្ថែម Cart មុន Login*; ក្រោយ Login នឹងបន្ថែម Product និង Quantity ហើយបើក `/cart`។
- **Guest ចុច Buy Now**៖ Login ជាមុនដូច Add to Bag; ក្រោយ Login បន្តទៅ Cart។
- **Click Favorites Icon**៖ Desktop/iPad ប្រើ Heart នៅ Header; Phone មាន Heart ក្នុង Bottom Navigation និង Hamburger Menu។ Account page មាន Favorites shortcut។
- **Wishlist ដាច់តាម User**៖ Stored ក្នុង Browser ដោយ Email សម្រាប់ Demo (Favorites ពី V4.8.1 អាចផ្លាស់ទៅ User ដែលបាន Login រួចនៅ Browser នោះ); ពេល Logout Wishlist នៅតែរក្សាទុកសម្រាប់ User នោះ ប៉ុន្តែមិនបង្ហាញពេល Guest។ Cart ត្រូវបាន Clear ពេល Logout។
- **Unavailable products**៖ ក្រោយ Login បើផលិតផលអស់ស្តុក ឬ Hidden នោះមិន Auto-add ទេ។

## Testing Flow (សាកល្បង)

1. បើក Website ក្នុង Incognito, click Heart លើ Product មួយ → Login → Wishlist មាន Product នោះ។
2. Logout → ចុច Add to Bag លើ Product មួយ → Login → `/cart` មាន Product មួយដែលបានជ្រើស (Quantity ត្រឹមត្រូវ)។
3. Logout → នៅ Product Detail ចុច Buy Now → Login → Cart មាន Product។
4. Login → ចុច Heart ផ្សេងទៀត → Click Heart នៅ Header (Desktop/iPad) ឬ Bottom Nav (Phone) → Saved Favorites។
5. Login ជាមួយ Demo User B → មិនឃើញ Favorites របស់ User A។ Login A វិញ → Favorites របស់ A នៅដដែល។
6. Click Cart / Favorites ពេល Guest → Login សិន។
7. Test Responsive: Phone 375px/430px, iPad 768px/1024px, Desktop 1440px។

## Run

```powershell
npm.cmd install
npm.cmd test
npm.cmd run dev
```

## Important

Customer Login មិនទាន់ Secure ក្នុង Browser-only Demo; ត្រូវភ្ជាប់ Backend សម្រាប់ Accounts ពិត។ Admin/Super Admin នៅ V4.8.2 នៅតែ Backend-only ដដែល។ Payment នៅជា Demo មិនទទួលប្រាក់ពិត និងគ្មាន Payment Verification។
