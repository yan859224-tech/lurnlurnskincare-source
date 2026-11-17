# LurnLurn Skincare V4.8 — របៀប Run និង Connect Backend

## 1. Run ក្នុង VS Code (Windows)

1. Extract ZIP ហើយ **Open Folder `lurnlurnskincare`** ដែលមាន `package.json`។
2. បើក Terminal ហើយ Run:

```powershell
npm.cmd install
npm.cmd test
npm.cmd run dev
```

3. បើក Storefront `http://localhost:5173/`, Admin `http://localhost:5173/admin.html`, Super Admin `http://localhost:5173/super-admin.html`។ ប្រើ Port ពិតដែល Vite បង្ហាញ។

## 2. Admin login មុនភ្ជាប់ Backend

- Admin/Super Admin Login **មិនអាចចូលបានទេ** ព្រោះគ្មាន Demo Password និងគ្មាន Demo Login Button។
- ទំព័រ Login បង្ហាញ “Backend not connected”។ នេះជាចេតនាដើម្បីរក្សាសុវត្ថិភាព។
- កុំវាយ Email/Password ពិតក្នុង Public Demo ដែលមិនទាន់មាន Backend HTTPS មានសុវត្ថិភាព។

## 3. Backend Developer ដាក់ Email / Password

បង្កើត `.env.local` នៅក្បែរ `package.json`៖

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

ប្តូរ URL ខាងលើទៅ Backend URL ពិត (ប្រើ HTTPS នៅ Production)។ Backend Developer ត្រូវបង្កើត Account និងផ្ដល់ Email/Password ដោយសុវត្ថិភាព ហើយ `/auth/me` ត្រូវផ្ញើ `role: "admin"` ឬ `"super_admin"` ដែលបានផ្ទៀងផ្ទាត់ពី Server។

Restart Vite (`Ctrl+C`, `npm.cmd run dev`) ព្រោះ env ផ្លាស់ប្តូរ។

## 4. Update Netlify

```powershell
npm.cmd run build
```

Upload Folder `dist` ទៅ Netlify Site ដែលអ្នកបានបង្កើត។ **សំខាន់៖** ការបង្កើត Frontend ZIP មិនបាន Deploy ឬបង្កើត Backend អោយអ្នកដោយស្វ័យប្រវត្តិទេ។ ប្រសិនបើ Login មិនបាន ត្រូវផ្ទៀងផ្ទាត់ API URL, CORS, cookies, Backend Database និង Role។

## 5. Data Motion

- Dashboard Overview: Numbers Count-up, Line Chart Draw Animation, Hover Tooltip, 7/30 Day filter.
- Products/Orders: Smooth Row Entrance និង Hover States.
- Sidebar/Menu: Smooth transitions, Mobile layout.
- Motion ត្រូវបានកាត់បន្ថយសម្រាប់អ្នកប្រើដែលកំណត់ `prefers-reduced-motion`។
- គ្មាន Server API នោះ Dashboard មិនបង្ហាញ Data ទេ។

អាន `BACKEND_HANDOFF_V48.md` សម្រាប់ API Schema និង Security Contract។
