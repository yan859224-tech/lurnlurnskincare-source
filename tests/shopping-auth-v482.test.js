import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path => readFileSync(new URL(path, import.meta.url),'utf8');
const app = read('../src/App.jsx');
const header = read('../src/components/UI.jsx');
const pages = read('../src/pages/Pages.jsx');
const css = read('../src/v4.css');

test('Add to Bag gates guests before changing the shopping bag',()=>{
 const body=app.split('const add=useCallback')[1].split('const buyNow=useCallback')[0];
 assert.match(body,/if\(!user\)/);
 assert.match(body,/setPending\(`cart:\$\{p\.id\}:\$\{count\}`\)/);
 assert.ok(body.indexOf('if(!user)')<body.indexOf('setCart(prev=>'));
 assert.match(body,/go\('auth'\)/);
});
test('Buy Now requires login and preserves quantity',()=>{
 const body=app.split('const buyNow=useCallback')[1].split('const openWishlist=useCallback')[0];
 assert.match(body,/if\(!user\)/);
 assert.match(body,/setPending\(`cart:/);
 assert.match(pages,/c\.buyNow\(p,qty\)/);
});
test('Heart and the Favorites destination require login',()=>{
 assert.match(app,/setPending\(`wishlist:\$\{id\}`\)/);
 assert.match(app,/setPending\('wishlist'\)/);
 assert.match(app,/else if\(pending==='wishlist'\)/);
 assert.match(app,/go\('wishlist'\)/);
});
test('Favorites appear as interactive header icon, mobile menu and mobile nav',()=>{
 assert.match(header,/className="v4-round v4-favorites-link"/);
 assert.match(header,/onClick=\{onWishlist\}/);
 assert.match(header,/v4-mobile-favorites/);
 assert.match(app,/<button onClick=\{openWishlist\} aria-label=\{t\.wishlist\}/);
 assert.match(css,/\.v4-bottom-nav button/);
});
test('Account-scoped favorites stay separate between customers',()=>{
 assert.match(app,/lurn_v482_wishlist_by_user/);
 assert.match(app,/wishByUser\[wishKey\]/);
 assert.match(app,/setWishByUser\(prev=>/);
 assert.doesNotMatch(app,/setWish\(\[\]\);setAddressId/);
});
test('Post-login pending item is applied only if still active and stocked',()=>{
 assert.match(app,/pending\.startsWith\('cart:'\)/);
 assert.match(app,/p\.active!==false/);
 assert.match(app,/Number\(product\.stock\)>0/);
 assert.match(app,/setCart\(prev=>/);
});
