import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=file=>readFileSync(file,'utf8');
test('payment route and component are kept in the customer app',()=>{
  const app=read('src/App.jsx'); const pages=read('src/pages/Pages.jsx');
  assert.match(app,/case'payment':return <PaymentPage c=\{c\}/);
  assert.match(pages,/export function PaymentPage/);
  assert.match(pages,/Cash on Delivery \(COD\)/);
  assert.match(pages,/ABA \/ KHQR/);
  assert.match(pages,/KHQR \(other banks\)/);
  assert.match(pages,/Visa \/ bank card/);
  assert.ok(existsSync('public/images/ban-bunyan-acleda-khqr-original.jpeg'));
});
test('checkout retains selection on refresh and has a visible payment action',()=>{
  const app=read('src/App.jsx');const pages=read('src/pages/Pages.jsx');
  assert.match(app,/useStored\('lurn_v49_checkout_address_id'/);
  assert.match(pages,/Continue to Payment/);
  assert.match(pages,/Choose a delivery address first/);
  assert.doesNotMatch(pages,/if\(!c.user\)c.startCheckout\(\);else if\(!c.cart.length\)c.go\('cart'\)/);
});
test('chatbot has fullscreen mobile mode and usable close button',()=>{
  const jsx=read('src/components/SkincareChatbot.jsx');const css=read('src/chatbot.css');
  assert.match(jsx,/lurn-chat-wrap \$\{open\?/);
  assert.match(css,/\.lurn-chat-wrap\.is-open \.lurn-chat-panel/);
  assert.match(css,/height:100dvh/);
  assert.match(css,/safe-area-inset-bottom/);
  assert.match(jsx,/aria-label="Close chat"/);
});
