import About from './pages/About.jsx';
import SkincareChatbot from './components/SkincareChatbot.jsx';
import {api,API_BASE} from './services/api.js';
import {ConsultationPage} from './pages/Consultation.jsx';
import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {ArrowUpRight,Send,Check,Heart} from 'lucide-react';
import {catalog as seedCatalog} from './catalog.js';
import {useStored,readStore,calcTotals,deliveryServices} from './store.js';
import {translations} from './i18n.js';
import {hasAuthBackend,supabase} from './auth.js';
import {canOpenAdmin} from './adminAccess.js';
import {Header,Footer} from './components/UI.jsx';
import {HomePage,ShopPage,ProductPage,ConcernsPage,QuizPage,PromotionsPage,CartPage,CheckoutPage,PaymentPage,AuthPage,AccountPage,SuccessPage,WishlistPage,ContactPage} from './pages/Pages.jsx';

function routeFromLocation(){
 const parts=decodeURIComponent(window.location.pathname).split('/').filter(Boolean);
 const valid=['home','shop','product','concerns','about','chat','quiz','promotions','cart','checkout','payment','auth','register','account','success','wishlist','contact','demo-admin','admin'];
 const page=valid.includes(parts[0])?parts[0]:'home';
 return {page,param:parts[1]||'',category:new URLSearchParams(window.location.search).get('category')||'All',brand:new URLSearchParams(window.location.search).get('brand')||'All',filters:new URLSearchParams(window.location.search).get('filters')==='1'};
}
function pathFor(name){
 if(name==='home')return '/';
 if(name==='shop-filters')return '/shop?filters=1';
 if(name.startsWith('shop:'))return '/shop?category='+encodeURIComponent(name.slice(5));
 if(name.startsWith('brand:'))return '/shop?brand='+encodeURIComponent(name.slice(6));
 return '/'+name;
}
export default function App(){
 const [route,setRoute]=useState(routeFromLocation);
 const [lang,setLang]=useStored('lumi_v4_language','en');
 const [theme,setTheme]=useStored('lumi_v4_theme','light');
 const [currency,setCurrency]=useStored('lumi_v4_currency','USD');
 const [cart,setCart]=useStored('lumi_v4_cart',readStore('lumi_cart',[]));
 const [wishByUser,setWishByUser]=useStored('lurn_v482_wishlist_by_user',{});
 const [inventory,setInventory]=useStored('lumi_v4_inventory_overrides',{});
 const [demoExtraProducts]=useStored('lurn_demo_added_products',[]);
 const [demoCampaigns]=useStored('lurn_demo_staff_promotions',null);
 const [demoUser,setDemoUser]=useStored('lumi_v4_demo_user',null);
 const [liveUser,setLiveUser]=useState(null);
 const [adminRole,setAdminRole]=useState({loading:hasAuthBackend,verified:false});
 const [adminBusy,setAdminBusy]=useState(false);
 const [orders,setOrders]=useStored('lumi_v4_orders',[]);
 const [addressBook,setAddressBook]=useStored('lumi_v4_addresses',{});
 const [addressId,setAddressId]=useStored('lurn_v49_checkout_address_id','');
 const [delivery,setDelivery]=useStored('lurn_v49_checkout_delivery','jt');
 const [note,setNote]=useStored('lurn_v49_checkout_note','');
 const [promo,setPromo]=useStored('lumi_v4_promo','');
 const [telegramHandle,setTelegramHandle]=useStored('lumi_v4_telegram',import.meta.env.VITE_TELEGRAM_USERNAME||'');
 const [lastOrder,setLastOrder]=useState(null);
 const [toast,setToast]=useState('');
 const [pending,setPending]=useState('');
 const toastTimer=useRef(null);
 const user=(API_BASE||hasAuthBackend)?liveUser:demoUser;
 // Wishlist is scoped by the signed-in customer, not shared between demo identities.
 const wishKey=user?.email?.trim().toLowerCase()||'';
 const wish=wishKey?(wishByUser[wishKey]||[]):[];
 const setWish=useCallback(update=>{
   if(!wishKey)return;
   setWishByUser(prev=>{
     const previous=prev[wishKey]||[];
     const next=typeof update==='function'?update(previous):update;
     return {...prev,[wishKey]:next};
   });
 },[wishKey,setWishByUser]);
 // One-time migration of favorites saved by an already signed-in V4.8.1 customer.
 // Never migrate when there is no account to avoid exposing favorites to a guest.
 useEffect(()=>{
   if(!wishKey)return;
   const legacy=readStore('lumi_v4_wish',[]);
   if(!Array.isArray(legacy)||!legacy.length)return;
   setWishByUser(prev=>{
     const previous=prev[wishKey]||[];
     return {...prev,[wishKey]:[...new Set([...previous,...legacy.filter(x=>Number.isFinite(Number(x)))])].map(Number)};
   });
   try{localStorage.removeItem('lumi_v4_wish')}catch{}
 },[wishKey,setWishByUser]);
 useEffect(()=>{if(API_BASE)api.me().then(d=>setLiveUser(d.user)).catch(()=>setLiveUser(null))},[]);
 const isAdmin=canOpenAdmin({backendEnabled:Boolean(API_BASE)||hasAuthBackend,user,verifiedRole:adminRole.verified || (Boolean(API_BASE)&&['admin','super_admin'].includes(user?.role))});
 const catalog=useMemo(()=>[...seedCatalog,...demoExtraProducts].map(p=>({...p,...(inventory[p.id]||{})})),[inventory,demoExtraProducts]);
 const visibleCatalog=useMemo(()=>catalog.filter(p=>p.active!==false),[catalog]);
 const t=translations[lang]||translations.en;
 const rate=Number(import.meta.env.VITE_KHR_PER_USD)||4000;
 // Correct grouping of KHR unit rounding (integer amounts only).
 const money=useCallback(n=>currency==='KHR'?`៛${(Math.round((Number(n)||0)*rate/100)*100).toLocaleString('en-US')}`:`$${Number(n||0).toFixed(2)}`,[currency,rate]);
 const cartCount=cart.reduce((sum,p)=>sum+p.qty,0);
 const addresses=useMemo(()=>user?(addressBook[user.email]||[]):[],[addressBook,user?.email]);
 const telegramUser=telegramHandle.replace(/^@/,'').trim().replace(/[^a-zA-Z0-9_]/g,'');
 const telegram=telegramUser.length>=5?`https://t.me/${telegramUser}`:'';

 const go=useCallback((name)=>{
   const path=pathFor(name);const current=window.location.pathname+window.location.search;
   if(current!==path)window.history.pushState({},'',path);
   setRoute(routeFromLocation());window.scrollTo({top:0,behavior:'instant'});
 },[]);
 const openProduct=useCallback(p=>go('product/'+p.id),[go]);
 const notify=useCallback(message=>{setToast(message);clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),3200)},[]);
 useEffect(()=>()=>clearTimeout(toastTimer.current),[]);
 useEffect(()=>{const pop=()=>setRoute(routeFromLocation());window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop)},[]);
 useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.lang=lang==='km'?'km':'en'},[theme,lang]);
 useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});const nodes=document.querySelectorAll('[data-reveal]');if(!('IntersectionObserver' in window))return;const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-revealed');io.unobserve(e.target)}}),{threshold:.08});nodes.forEach(n=>io.observe(n));return()=>io.disconnect()},[route.page,route.param,route.category,route.brand]);
 useEffect(()=>{if(!supabase)return;let active=true;supabase.auth.getUser().then(({data})=>{if(active){const u=data?.user;setLiveUser(u?{id:u.id,email:u.email,name:u.user_metadata?.full_name||u.email.split('@')[0]}:null)}});const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{if(active){const u=s?.user;setLiveUser(u?{id:u.id,email:u.email,name:u.user_metadata?.full_name||u.email.split('@')[0]}:null)}});return()=>{active=false;subscription.unsubscribe()}},[]);
 // Roles are read from a server-protected Supabase table; the email alone NEVER grants production access.
 useEffect(()=>{if(!hasAuthBackend||!liveUser?.id){setAdminRole({loading:false,verified:false});return;}
  let active=true;setAdminRole({loading:true,verified:false});
  supabase.from('admin_users').select('user_id').eq('user_id',liveUser.id).maybeSingle().then(({data,error})=>{
   if(!active)return;
   setAdminRole({loading:false,verified:!error&&data?.user_id===liveUser.id});
  });
  return()=>{active=false};
 },[liveUser?.id]);
 // Load public-safe product overrides; edits are protected by Supabase RLS.
 useEffect(()=>{if(!hasAuthBackend)return;let active=true;
  supabase.from('store_product_overrides').select('product_id,price,stock,active').then(({data,error})=>{
   if(!active||error||!data)return;
   setInventory(Object.fromEntries(data.map(r=>[r.product_id,{price:Number(r.price),stock:r.stock,active:r.active}])));
  });
  supabase.from('store_settings').select('value').eq('key','telegram').maybeSingle().then(({data,error})=>{
   if(active&&!error&&data?.value)setTelegramHandle(data.value);
  });
  return()=>{active=false};
 },[]);
 useEffect(()=>{if(addresses.length&&!addresses.some(a=>a.id===addressId))setAddressId(addresses[0].id)},[addresses,addressId]);
 // Keep the selected address on refresh. Selection is validated against the current user's address book.
 const add=useCallback((p,quantity=1)=>{
   if(!p||p.active===false||Number(p.stock)<1){notify(lang==='km'?'ផលិតផលនេះអស់ស្តុកហើយ':'This listing is currently unavailable');return;}
   const count=Math.max(1,Math.min(99,Number(quantity)||1));
   if(!user){
     // No cart mutation until authentication succeeds; preserve the intended item and quantity.
     setPending(`cart:${p.id}:${count}`);
     notify(lang==='km'?'សូមចូលគណនីមុនដាក់ក្នុងកន្ត្រក':'Please sign in to add to your bag');
     go('auth');return;
   }
   setCart(prev=>{const found=prev.find(x=>x.id===p.id);const max=Math.max(0,Number(p.stock)||0);return found?prev.map(x=>x.id===p.id?{...x,qty:Math.min(max,x.qty+count)}:x):[...prev,{...p,qty:Math.min(max,count)}]});
   notify(lang==='km'?'បានបន្ថែមក្នុងកន្ត្រក':'Added to your bag');
 },[user,setCart,notify,lang,go,setPending]);
 const buyNow=useCallback((p,quantity=1)=>{
   if(!p||p.active===false||Number(p.stock)<1){notify('This listing is currently unavailable');return;}
   if(!user){setPending(`cart:${p.id}:${Math.max(1,Math.min(99,Number(quantity)||1))}`);notify(lang==='km'?'សូមចូលគណនីមុនទិញ':'Please sign in before buying');go('auth');return;}
   add(p,quantity);go('cart');
 },[user,add,go,notify,lang]);
 const openWishlist=useCallback(()=>{
   if(!user){setPending('wishlist');notify(lang==='km'?'សូមចូលគណនីមុនមើលទំនិញចូលចិត្ត':'Sign in to see your favorites');go('auth');return;}
   go('wishlist');
 },[user,go,notify,lang]);
 const openCart=useCallback(()=>{
   if(!user){setPending('cart:view');notify(lang==='km'?'សូមចូលគណនីមុនមើលកន្ត្រក':'Sign in to view your bag');go('auth');return;}
   go('cart');
 },[user,go,notify,lang]);
 const qty=useCallback((id,delta)=>setCart(prev=>prev.map(p=>p.id===id?{...p,qty:Math.min(catalog.find(x=>x.id===id)?.stock??99,p.qty+delta)}:p).filter(p=>p.qty>0)),[setCart]);
 const remove=useCallback(id=>setCart(prev=>prev.filter(p=>p.id!==id)),[setCart]);
 const toggleWish=useCallback(id=>{
   if(!user){setPending(`wishlist:${id}`);notify(lang==='km'?'សូមចូលគណនីដើម្បីរក្សាទុកផលិតផលដែលចូលចិត្ត':'Sign in to save your favorites');go('auth');return;}
   setWish(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
 },[user,lang,notify,go,setWish]);
 const saveAddress=useCallback(a=>{if(!user)return;setAddressBook(prev=>({...prev,[user.email]:[...(prev[user.email]||[]),a]}));setAddressId(a.id);notify('Address saved')},[user,setAddressBook,notify]);
 const startCheckout=useCallback(()=>{if(!cart.length)return;if(cart.some(item=>{const current=catalog.find(x=>x.id===item.id);return !current||current.active===false||current.stock<item.qty})){notify(lang==='km'?'សូមកែស្តុកក្នុងកន្ត្រក មុនបន្តកម្ម៉ង់':'Cart stock changed. Please review your bag before checkout.');go('cart');return;}if(!user){setPending('checkout');go('auth')}else go('checkout')},[cart,user,catalog,go,notify,lang]);
 const authenticate=useCallback(async({mode,name,email,password})=>{
  if(API_BASE){const data=await (mode==='register'?api.register({name,email,password}):api.login({email,password}));setLiveUser(data.user);}
  else if(hasAuthBackend){if(!supabase)throw Error('Authentication service unavailable');
   if(mode==='register'){const{data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name}}});if(error)throw error;if(!data.session){notify('Confirm your email, then sign in to continue.');return}setLiveUser({id:data.user.id,email:data.user.email,name:name||email.split('@')[0]})}
   else{const{data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;setLiveUser({id:data.user.id,email:data.user.email,name:data.user.user_metadata?.full_name||email.split('@')[0]})}
  }else{if(!name.trim())throw Error('Name is required for browser-only demo access.');setDemoUser({id:'demo-'+email.toLowerCase(),email:email.trim().toLowerCase(),name:name.trim()})}
  const signedInEmail=(email||'').trim().toLowerCase();
  if(pending.startsWith('wishlist:')){
    const wishId=Number(pending.slice('wishlist:'.length));
    if(catalog.some(p=>p.id===wishId&&p.active!==false)){
      setWishByUser(prev=>{const saved=prev[signedInEmail]||[];return {...prev,[signedInEmail]:saved.includes(wishId)?saved:[...saved,wishId]}});
    }
    go('wishlist');
  }else if(pending==='wishlist'){
    go('wishlist');
  }else if(pending.startsWith('cart:')){
    const [,idText,qtyText]=pending.split(':');
    const product=catalog.find(p=>String(p.id)===idText&&p.active!==false);
    if(product&&Number(product.stock)>0){
      const quantity=Math.max(1,Math.min(Number(product.stock),Number(qtyText)||1));
      setCart(prev=>{const found=prev.find(x=>x.id===product.id);return found?prev.map(x=>x.id===product.id?{...x,qty:Math.min(Number(product.stock),x.qty+quantity)}:x):[...prev,{...product,qty:quantity}]});
    }else notify('Selected product is no longer available');
    go('cart');
  }else if(pending==='admin')go('admin');
  else go(pending||'account');
  setPending('');notify('Welcome to LurnLurnskincare');
 },[pending,go,notify,setDemoUser,setWishByUser,catalog,setCart]);
 const signOut=useCallback(async()=>{if(API_BASE){await api.logout();setLiveUser(null)}else if(supabase)await supabase.auth.signOut();else setDemoUser(null);setCart([]);setPending('');setAddressId('');go('home');notify('Signed out')},[go,notify,setDemoUser,setCart,setPending,setAddressId]);
 const placeOrder=useCallback(method=>{if(!user||!cart.length||!addressId)return;if(cart.some(item=>{const current=catalog.find(x=>x.id===item.id);return !current||current.active===false||current.stock<item.qty})){notify('One or more items are unavailable. Please update your cart.');go('cart');return;}const addr=addresses.find(a=>a.id===addressId);if(!addr)return;const svc=deliveryServices.find(x=>x.id===delivery);const totals=calcTotals(cart,delivery,promo);const order={id:'LS-'+Date.now().toString(36).toUpperCase(),createdAt:new Date().toISOString(),customer:{id:user.id,name:user.name,email:user.email},address:{...addr},delivery,deliveryName:svc?.name||delivery,items:cart.map(({id,name,brand,price,qty,size})=>({id,name,brand,price,qty,size})),note,payment:method,paymentStatus:method==='cod'?'cod-not-paid':'pending',totals,isDemo:true};setOrders(prev=>[order,...prev]);setLastOrder(order);setCart([]);setNote('');setPromo('');go('success')},[user,cart,addressId,addresses,delivery,promo,note,catalog,notify,setOrders,setCart,setPromo,go]);
 const updateProduct=useCallback(async(id,change)=>{
  if(!isAdmin)throw Error('Admin permission required');
  setAdminBusy(true);
  try{
   const previous=inventory[id]||{};
   const current=catalog.find(p=>p.id===id);
   if(!current)throw Error('Product not found');
   const record={product_id:Number(id),price:change.price??previous.price??current.price,stock:change.stock??previous.stock??current.stock??0,active:change.active??previous.active??true};
   if(hasAuthBackend){const{error}=await supabase.from('store_product_overrides').upsert(record,{onConflict:'product_id'});if(error)throw error;}
   setInventory(prev=>({...prev,[id]:{...previous,...record,price:Number(record.price)}}));
   notify(hasAuthBackend?'Product saved to store database':'Local demo product updated');
  }finally{setAdminBusy(false)}
 },[isAdmin,hasAuthBackend,inventory,catalog,setInventory,notify]);
 const saveTelegramAdmin=useCallback(async(value)=>{
  if(!isAdmin)throw Error('Admin permission required');
  const clean=value.replace(/^@/,'').trim();
  if(clean&&!/^[a-zA-Z0-9_]{5,32}$/.test(clean))throw Error('Telegram username must be 5–32 letters, numbers or underscores');
  if(hasAuthBackend){const{error}=await supabase.from('store_settings').upsert({key:'telegram',value:clean},{onConflict:'key'});if(error)throw error;}
  setTelegramHandle(clean);notify(hasAuthBackend?'Settings saved to database':'Local demo settings saved');
 },[isAdmin,hasAuthBackend,setTelegramHandle,notify]);
 const c={go,t,lang,theme,currency,campaigns:demoCampaigns,setCurrency,money,fmt:money,user,cart,cartCount,catalog:visibleCatalog,adminCatalog:catalog,wish,orders,addressBook,addresses,addressId,setAddressId,delivery,setDelivery,note,setNote,promo,setPromo,telegram,telegramHandle,setTelegramHandle,notify,add,buyNow,openCart,openWishlist,qty,remove,toggleWish,openProduct,startCheckout,authenticate,signOut,saveAddress,placeOrder,updateProduct,saveTelegramAdmin,adminBusy,isAdmin,adminRole,hasAuthBackend:Boolean(API_BASE)||hasAuthBackend,lastOrder};
 const activeProduct=visibleCatalog.find(p=>String(p.id)===route.param);
 const render=()=>{
 switch(route.page){case'home':return <HomePage c={c}/>;case'shop':return <ShopPage c={c} initial={route.category} initialBrand={route.brand} openFilters={route.filters}/>;case'product':return <ProductPage c={c} p={activeProduct}/>;case'concerns':return <ConcernsPage c={c}/>;case'about':return <About c={c}/>;case'quiz':return <QuizPage c={c}/>;case'chat':return <ConsultationPage c={c}/>;case'promotions':return <PromotionsPage c={c}/>;case'cart':return <CartPage c={c}/>;case'checkout':return <CheckoutPage c={c}/>;case'payment':return <PaymentPage c={c}/>;case'auth':case'register':return <AuthPage c={c} mode={route.page==='register'?'register':'login'}/>;case'account':return <AccountPage c={c}/>;case'success':return <SuccessPage c={c}/>;case'wishlist':return <WishlistPage c={c}/>;case'contact':return <ContactPage c={c}/>;case'demo-admin':case'admin':return <div className="v4-container v4-page"><h1>Team workspace</h1><a href="/admin.html">Admin sign in</a> · <a href="/super-admin.html">Super Admin sign in</a></div>;default:return <HomePage c={c}/>}
 };
 return <div className="v4-app min-h-screen"><Header go={go} t={t} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} currency={currency} setCurrency={setCurrency} user={user} isAdmin={isAdmin} cartCount={cartCount} wishCount={wish.length} onWishlist={openWishlist} onCart={openCart} catalog={visibleCatalog} openProduct={openProduct}/><div className="v4-progress" aria-hidden="true"/><main className="v4-main v4-page-enter" key={`${route.page}-${route.param}-${route.category}-${route.brand}-${route.filters}`}>{render()}</main><Footer go={go} t={t} telegram={telegram}/><SkincareChatbot telegram={telegram} lang={lang} catalog={visibleCatalog} money={money} openProduct={openProduct} go={go}/>{toast&&<div role="status" className="v4-toast"><Check size={17}/>{toast}</div>}<nav className="v4-bottom-nav"><button onClick={()=>go('home')}>⌂<span>{t.home}</span></button><button onClick={()=>go('shop')}>✳<span>{t.shop}</span></button><button onClick={openWishlist} aria-label={t.wishlist}><Heart size={20} fill={wish.length?'currentColor':'none'}/><span>{lang==='km'?'ចូលចិត្ត':'Favorites'}{wish.length>0?` (${wish.length})`:''}</span></button><button onClick={openCart}>▣<span>{t.cart}</span></button><button onClick={()=>go('account')}>♙<span>{t.account}</span></button></nav></div>
}
