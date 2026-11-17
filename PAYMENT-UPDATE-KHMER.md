# LUMI SKINCARE V4 — Payment UI update

- ជ្រើស ABA KHQR ឬ KHQR: បើក Popup ភ្លាមៗ និងបង្ហាញរូប ACLEDA KHQR ដើម ដោយគ្មាន Blur ឬ Watermark។
- សំខាន់: នេះជា QR ពិតដែលអាច Scan និងផ្ទេរប្រាក់បាន។ QR ជា Static Account QR; ចំនួន Total ដែលបង្ហាញនៅលើ Website មិនបាន Encode ក្នុង QR នោះទេ។ កុំប្រើសម្រាប់ Test ដោយផ្ទេរប្រាក់។
- ជ្រើស Visa: បើក Form អាចវាយលេខកាត TEST `4242 4242 4242 4242` ឧទាហរណ៍ Expiry `12/30`, Demo Digits `123` និងឈ្មោះសាកល្បង។ មិនទទួល កត់ត្រា ឬផ្ញើព័ត៌មានកាតទៅ Server ទេ។ កុំបញ្ចូលព័ត៌មានកាតពិត។
- ប៊ូតុង Check test details គ្រាន់តែពិនិត្យ UI មិនទូទាត់ប្រាក់។
- សម្រាប់ការទូទាត់ពិត៖ ប្រើ Hosted Checkout ដែលមានសុវត្ថិភាព និង Backend Webhook Verification។
- គោលការណ៍ Demo៖ មិនប្ដូរ Order ទៅ Paid ដោយស្វ័យប្រវត្តិ។

## Netlify
បើក Folder `lumi-skin` ដែលមាន `package.json` រួច៖
```powershell
npm.cmd install
npm.cmd run build
```
Upload `dist` ទៅ Netlify Deploys។
