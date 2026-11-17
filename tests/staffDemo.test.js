import test from 'node:test';
import assert from 'node:assert/strict';
import {sections,isStaffRole,keys,listDemo,overviewDemo,saveDemo,createDemo,resetDemo,csvExport,seedPromotions} from '../src/services/demoStaff.js';
import {makePromotions} from '../src/promotions.js';
import {catalog} from '../src/catalog.js';
const store=new Map();
globalThis.localStorage={getItem:(k)=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:(k)=>store.delete(k)};
globalThis.window={dispatchEvent:()=>{}};
globalThis.CustomEvent=class{constructor(name,opts){this.type=name;this.detail=opts?.detail}};
function clean(){store.clear()}
test('role-based UI sections do not expose super admin settings to admin',()=>{
 assert.equal(isStaffRole('admin','products'),true);
 assert.equal(isStaffRole('admin','team'),false);
 assert.equal(isStaffRole('admin','audit'),false);
 assert.equal(isStaffRole('super_admin','settings'),true);
 assert.deepEqual(sections.admin,['overview','products','orders','conversations','promotions']);
});
test('demo catalog includes 39 original named products and supports local stock and price changes',()=>{
 clean();const original=listDemo('products');assert.ok(original.length>=39);
 const before=original[0];saveDemo('admin','products',before.id,{stock:0,price:7.25,active:false},'Admin');
 const after=listDemo('products').find(p=>p.id===before.id);
 assert.equal(after.stock,0);assert.equal(after.price,7.25);assert.equal(after.active,false);
 const key=JSON.parse(store.get(keys.products));assert.equal(key[before.id].stock,0);
});
test('admin demo cannot modify team or settings',()=>{
 clean();assert.throws(()=>saveDemo('admin','settings','store',{name:'Unauthorized'},'Admin'),/does not allow/);
 assert.throws(()=>createDemo('admin','team',{name:'Not allowed'},'Admin'),/does not allow/);
});
test('new products appear in added-products localStorage key and catalog listing',()=>{
 clean();const newP=createDemo('admin','products',{name:'Sample Moisture Cream',brand:'Demo Brand',category:'Moisturizers',price:12.2,stock:4},'Admin');
 assert.ok(newP.id>=1000);assert.equal(listDemo('products').find(p=>p.id===newP.id).name,'Sample Moisture Cream');
 assert.equal(JSON.parse(store.get(keys.added)).length,1);
});
test('campaign editor drives promotional carousel',()=>{
 clean();const initial=listDemo('promotions');assert.equal(initial.length,4);
 saveDemo('admin','promotions','AD-001',{active:false},'Admin');
 const promo=listDemo('promotions');const shown=makePromotions(catalog,promo);
 assert.ok(shown.length>0);assert.ok(shown.every(x=>x.id!=='AD-001'));
});
test('order edits preserve initial customer browser data and alter demo status',()=>{
 clean();const order=listDemo('orders')[0];saveDemo('admin','orders',order.id,{status:'delivered'},'Admin');
 assert.equal(listDemo('orders').find(x=>x.id===order.id).status,'delivered');
});
test('conversation simulated reply can be saved without external Telegram',()=>{
 clean();const conv=listDemo('conversations')[0];saveDemo('admin','conversations',conv.id,{messages:[...conv.messages,{from:'staff',text:'Demo response'}],status:'resolved'},'Admin');
 assert.equal(listDemo('conversations')[0].status,'resolved');assert.equal(listDemo('conversations')[0].messages.at(-1).text,'Demo response');
});
test('super admin can edit team and reset local demo records',()=>{
 clean();saveDemo('super_admin','team','STAFF-01',{name:'New Demo Name'},'Super Admin');assert.equal(listDemo('team')[0].name,'New Demo Name');
 assert.ok(listDemo('audit').length>=1);resetDemo('super_admin');assert.equal(store.has(keys.team),false);assert.equal(listDemo('team')[0].name,'Admin');
});
test('CSV export escapes commas and formula input as text fields',()=>{
 const csv=csvExport([{name:'A, B',description:'says "hello"'}]);assert.match(csv,/"A, B"/);assert.match(csv,/"says ""hello"""/);
});
