# LurnLurn Skincare V4.8 — Customer Frontend import fix

## Problem
Vite error: `Failed to resolve import "./pages/AdminDashboard.jsx" from "src/App.jsx"`.

The V4.8 customer storefront had a leftover import of a deleted/unused page. The dedicated Admin/Super Admin UIs do **not** use this component.

## Fixed
Removed the unused `import AdminDashboard from './pages/AdminDashboard.jsx';` from `src/App.jsx`. No new dummy admin page was created; separate `admin.html` and `super-admin.html` continue to load their own components.

Added `tests/source-imports.test.js` to detect unresolved relative imports before shipping.

## Run in Windows VS Code PowerShell
Open the inner folder `lurnlurnskincare` containing `package.json` and run:

```powershell
npm.cmd install
npm.cmd test
npm.cmd run dev
```

Open the customer storefront at the Local URL printed by Vite (commonly `http://localhost:5173/`). Admin pages remain `/admin.html` and `/super-admin.html`; they require configured backend authentication in V4.8.

For Netlify run `npm.cmd run build`, then deploy `dist` only if the build succeeds.

## Caution
The automated JS unit tests and import path test pass. A complete production build was not verified in this environment because npm dependencies could not be installed here; please run the build on your computer.
