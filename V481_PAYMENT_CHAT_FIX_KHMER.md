# LurnLurn Skincare V4.8.1 — Payment + Chat Responsiveness

## អ្វីដែលកែ
- **Payment មិនបាត់**៖ `Cart → Checkout → Payment`. ប្រសិនបើគ្មាន Address ឬ Cart ទំព័រនឹងបង្ហាញសារមាន Button ជួយជំនួសការ Redirect ដោយស្ងៀមស្ងាត់។
- Address, Delivery និង Note រក្សាទុកក្នុង Browser សម្រាប់ Refresh នៅ Device ដដែល។
- Payment មាន COD, ABA/KHQR, KHQR និង Visa Test Form។ រូប QR Original មិនប្តូរ; អាចបង់ប្រាក់ពិតបាន — កុំ Scan ក្នុងការសាកល្បង។
- **Chatbot Responsive**៖ លើ Phone ចុច Chat? → ផ្ទាំងជជែកពេញអេក្រង់, Safe Areas, Scroll Messages, Quick Replies, Telegram link និង Close Button។ លើ iPad/Desktop ជា Floating Panel។
- Admin និង Super Admin នៅប្រើ Backend Login ជាដដែល (គ្មាន Demo Admin bypass)។

## Run
1. Extract ZIP រួចចូល Folder `lurnlurnskincare` (មាន package.json)
2. `npm.cmd install`
3. `npm.cmd test`
4. `npm.cmd run dev`
5. បើក `http://localhost:5173/`, Add Product → Cart → Login → Address → Continue to Payment

## Netlify
- `npm.cmd run build` ហើយ Upload Folder `dist` (មិនមែន ZIP និងមិនមែន node_modules)។
- កុំបញ្ចូលលេខកាតពិតក្នុង Visa Test Form។ QR Static ជារូបពិតរបស់ម្ចាស់ហាង, មិនមាន Server-side Payment Confirmation។

## QA
Test widths: 320, 375, 390, 430, 768, 1024, 1440 px; iOS Safari and Chrome, Android Chrome, Desktop.
- Open Chat on iPhone, type with software keyboard, swipe messages and close.
- At Checkout create Address and select courier; refresh then continue to Payment.
- Payment QR modal can scroll vertically; no off-screen buttons.
- Visa form accepts test data only; status stays unpaid.
