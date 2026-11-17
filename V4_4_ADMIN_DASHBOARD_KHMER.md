# LUMI SKINCARE V4.4 — Admin Dashboard

**User label:** Admin  
**Email:** bunyanban20@gmail.com  
**Route:** `/admin`

### UI ថ្មី
- Overview: ចំនួន Products, Active listings, Local Test Orders, តម្លៃទំនិញ Test
- Product Management: Edit Price, Stock, Active/Hidden (ហាងសម្រាប់ Demo)
- Orders: បង្ហាញតែ Orders ក្នុង Browser បច្ចុប្បន្ន (មិនមែន Database Orders ពិត)
- Settings: កំណត់ Telegram Username
- Mobile/iPad Responsive Dashboard

### Test ក្នុង Demo
ចូល `/auth`, បញ្ចូល Name: `Admin`, Email: `bunyanban20@gmail.com`, ចុច Continue.  
**ការព្រមាន:** Demo Mode មិនមាន Password និងមិនមានការការពារសុវត្ថិភាពទេ។ មនុស្សគ្រប់គ្នាអាចបញ្ចូលឈ្មោះ/Email ដូចគ្នា ដូច្នេះវាត្រូវប្រើសាកល្បង UI ប៉ុណ្ណោះ។

### Production Auth
អនុវត្តតាម `docs/ADMIN_SETUP_KHMER.md` ដើម្បីភ្ជាប់ Supabase Auth និង Role-based permissions តាម `admin_users` + RLS។ កុំដាក់ Admin Password ឬ Secret Key ក្នុង Source Code។

### Netlify
ចូល Folder `lumi-skin` → `npm.cmd install` → `npm.cmd run build` → Upload `dist` ទៅ Netlify site ដដែល។
