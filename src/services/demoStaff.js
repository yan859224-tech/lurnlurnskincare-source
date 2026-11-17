/**
 * Isolated browser-only staff sandbox. Not authentication or authorization.
 * Every mutation occurs in this browser's localStorage; replace this service with
 * authenticated server endpoints before accepting real merchant data.
 */
import {catalog as seedCatalog} from '../catalog.js';
export const keys={products:'lumi_v4_inventory_overrides',added:'lurn_demo_added_products',orders:'lurn_demo_staff_orders',orderUpdates:'lurn_demo_order_overrides',conversations:'lurn_demo_staff_conversations',promotions:'lurn_demo_staff_promotions',team:'lurn_demo_staff_team',settings:'lurn_demo_staff_settings',audit:'lurn_demo_staff_audit'};
export const sections={admin:['overview','products','orders','conversations','promotions'],super_admin:['overview','products','orders','conversations','promotions','team','settings','audit']};
export const isStaffRole=(role,section)=>sections[role]?.includes(section)===true;
export const readJSON=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
export const writeJSON=(key,value)=>{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent('lurn-demo-update',{detail:{key}}));return value};
const stamp=(daysAgo=0)=>new Date(Date.now()-daysAgo*86400000).toISOString();
const orderSeed=()=>[
 {id:'DEMO-1001',createdAt:stamp(0),customer:{name:'Sokha (sample)',email:'sample1@example.test'},items:[{name:'Madagascar Centella Ampoule',qty:2,price:18}],totals:{total:40.5},deliveryName:'J&T Express',payment:'cod',paymentStatus:'cod-not-paid',status:'new',isDemo:true},
 {id:'DEMO-1002',createdAt:stamp(1),customer:{name:'Malis (sample)',email:'sample2@example.test'},items:[{name:'1025 Dokdo Toner',qty:1,price:17}],totals:{total:19},deliveryName:'VET',payment:'khqr',paymentStatus:'pending',status:'processing',isDemo:true},
 {id:'DEMO-1003',createdAt:stamp(3),customer:{name:'Dara (sample)',email:'sample3@example.test'},items:[{name:'345 Relief Cream',qty:2,price:23}],totals:{total:49},deliveryName:'PP Delivery',payment:'cod',paymentStatus:'cod-not-paid',status:'shipped',isDemo:true},
 {id:'DEMO-1004',createdAt:stamp(6),customer:{name:'Nita (sample)',email:'sample4@example.test'},items:[{name:'DIVE-IN Serum',qty:1,price:20}],totals:{total:22},deliveryName:'ZTO',payment:'cod',paymentStatus:'cod-not-paid',status:'delivered',isDemo:true}
];
const conversationSeed=()=>[
 {id:'CHAT-1001',name:'Website visitor (sample)',channel:'Web chat',subject:'Sensitive skin routine',status:'open',messages:[{from:'customer',text:'Do you have gentle skincare for sensitive skin?',at:stamp(0)}],updatedAt:stamp(0)},
 {id:'CHAT-1002',name:'Demo customer',channel:'Telegram (sample only)',subject:'Delivery options',status:'open',messages:[{from:'customer',text:'Do you ship to Siem Reap?',at:stamp(1)}],updatedAt:stamp(1)},
 {id:'CHAT-1003',name:'Demo customer',channel:'Web chat',subject:'Order inquiry',status:'resolved',messages:[{from:'customer',text:'How do I check my order?',at:stamp(2)},{from:'staff',text:'Please check My Orders after signing in (sample reply).',at:stamp(2)}],updatedAt:stamp(2)}
];
export const seedPromotions=()=>[
 {id:'AD-001',productId:4,promoType:'discount',promoLabel:'DEMO DISCOUNT',promoLine:'The glow edit · example 15% offer',discountPercent:15,active:true,priority:1},
 {id:'AD-002',productId:1,promoType:'bestseller',promoLabel:'CURATED BESTSELLER',promoLine:'A featured favorite · sample selection',discountPercent:0,active:true,priority:2},
 {id:'AD-003',productId:113,promoType:'trending',promoLabel:'TRENDING PICK',promoLine:'Explore a new ritual · sample selection',discountPercent:0,active:true,priority:3},
 {id:'AD-004',productId:102,promoType:'promotion',promoLabel:'FEATURED COLLECTION',promoLine:'Find your daily skin essentials',discountPercent:0,active:true,priority:4}
];
const teamSeed=()=>[
 {id:'STAFF-01',name:'Admin',email:'demo-admin@example.test',role:'admin',status:'active'},
 {id:'STAFF-02',name:'Super Admin (demo)',email:'superadmin@lurnlurn.demo',role:'super_admin',status:'active'}
];
const settingsSeed=()=>[{id:'store',name:'LurnLurn Skincare',telegram:'',currency:'USD',announcement:'A thoughtful skincare ritual starts here',supportEmail:'',deliveryNote:'Delivery fees are sample estimates.'}];
function initial(key,seed){const old=readJSON(key,null);if(Array.isArray(old))return old;const data=seed();localStorage.setItem(key,JSON.stringify(data));return data}
export function listDemo(resource){
 switch(resource){
  case 'products':{
    const overrides=readJSON(keys.products,{});const added=readJSON(keys.added,[]);
    return [...seedCatalog,...added].map(p=>({...p,...(overrides[p.id]||{}),stock:Number(overrides[p.id]?.stock??p.stock??20),active:overrides[p.id]?.active??p.active??true}));
  }
  case 'orders':{const base=initial(keys.orders,orderSeed),site=readJSON('lumi_v4_orders',[]),updates=readJSON(keys.orderUpdates,{});return [...site,...base].filter((p,i,a)=>a.findIndex(x=>x.id===p.id)===i).map(o=>({...o,...(updates[o.id]||{})})).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));}
  case 'conversations':return initial(keys.conversations,conversationSeed);
  case 'promotions':return initial(keys.promotions,seedPromotions);
  case 'team':return initial(keys.team,teamSeed);
  case 'settings':return initial(keys.settings,settingsSeed);
  case 'audit':return readJSON(keys.audit,[]);
  default:return [];
 }
}
export function overviewDemo(){const p=listDemo('products'),o=listDemo('orders'),ch=listDemo('conversations'),pr=listDemo('promotions');return {productCount:p.length,activeProducts:p.filter(x=>x.active).length,lowStock:p.filter(x=>x.stock<=5).length,orderCount:o.length,pendingOrders:o.filter(x=>['new','processing'].includes(x.status||'new')).length,revenue:o.filter(x=>x.status==='delivered').reduce((s,x)=>s+Number(x.totals?.total||0),0),openChats:ch.filter(x=>x.status==='open').length,activePromos:pr.filter(x=>x.active).length};}
function audit(section,verb,id,actor){const logs=readJSON(keys.audit,[]);writeJSON(keys.audit,[{id:'LOG-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),at:new Date().toISOString(),actor:actor||'Demo operator',section,action:verb,target:String(id)},...logs].slice(0,100));}
function assertRole(role,section){if(!isStaffRole(role,section))throw new Error('This demo role does not allow '+section+'.');}
export function saveDemo(role,resource,id,changes,actor){assertRole(role,resource);const safe={...changes};delete safe.id;
 if(resource==='products'){
   const p=listDemo('products').find(p=>String(p.id)===String(id));if(!p)throw Error('Product not found');
   if(!Number.isFinite(Number(safe.price??p.price))||Number(safe.price??p.price)<0)throw Error('Price must be 0 or higher');
   if(!Number.isInteger(Number(safe.stock??p.stock))||Number(safe.stock??p.stock)<0)throw Error('Stock must be a non-negative integer');
   const overrides=readJSON(keys.products,{});overrides[id]={...(overrides[id]||{}),...safe,price:Number(safe.price??p.price),stock:Number(safe.stock??p.stock)};writeJSON(keys.products,overrides);
 } else if(resource==='orders'){
   const overrides=readJSON(keys.orderUpdates,{});overrides[id]={...(overrides[id]||{}),...safe};writeJSON(keys.orderUpdates,overrides);
 } else {
   const items=listDemo(resource);if(!items.some(x=>String(x.id)===String(id)))throw Error('Record not found');
   writeJSON(keys[resource],items.map(x=>String(x.id)===String(id)?{...x,...safe}:x));
 }
 audit(resource,'Updated',id,actor);return {ok:true};
}
export function createDemo(role,resource,item,actor){assertRole(role,resource);if(!['products','promotions','conversations','team'].includes(resource))throw Error('Creation not supported for this demo collection');
 if(resource==='team'&&role!=='super_admin')throw Error('Super Admin required');
 const current=listDemo(resource);const id=resource==='products'?Math.max(1000,...current.map(p=>Number(p.id)||0))+1:'DEMO-'+Date.now();
 const row={...item,id};if(resource==='products'){
  if(!row.name?.trim()||!row.brand?.trim())throw Error('Product name and brand are required');
  row.price=Number(row.price);row.stock=Number(row.stock);
  if(!Number.isFinite(row.price)||row.price<0||!Number.isInteger(row.stock)||row.stock<0)throw Error('Enter valid price and stock');
  row.active=true;row.image=row.image||'/product-photo-pending.svg';row.category=row.category||'Serums';row.concerns=[];row.benefits=[];row.source='';row.color='#f0eee8';
  writeJSON(keys.added,[...readJSON(keys.added,[]),row]);
 }else writeJSON(keys[resource],[...current,row]);audit(resource,'Created',id,actor);return row;
}
export function removeDemo(role,resource,id,actor){assertRole(role,resource);if(!['promotions','conversations','team'].includes(resource))throw Error('Delete is disabled for this collection');
 if(resource==='team'&&role!=='super_admin')throw Error('Super Admin required');
 if(resource==='team'&&String(id)==='STAFF-02')throw Error('Keep a Super Admin in the demo team');
 writeJSON(keys[resource],listDemo(resource).filter(x=>String(x.id)!==String(id)));audit(resource,'Removed',id,actor);
}
export function resetDemo(role){if(role!=='super_admin')throw Error('Super Admin demo required to reset sample data');Object.values(keys).forEach(k=>localStorage.removeItem(k));window.dispatchEvent(new CustomEvent('lurn-demo-update',{detail:{key:'reset'}}));}
export function csvExport(rows){const keys=[...new Set(rows.flatMap(x=>Object.keys(x).filter(k=>typeof x[k]!=='object')))];const escape=x=>{let v=String(x??'');if(/^[\s]*[=+\-@]/.test(v))v="\'"+v;return '"'+v.replaceAll('"','""')+'"'};return [keys.map(escape).join(','),...rows.map(x=>keys.map(k=>escape(x[k])).join(','))].join('\r\n');}
