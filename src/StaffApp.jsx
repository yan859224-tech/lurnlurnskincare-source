import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {ArrowDownToLine,ArrowRight,Check,Edit3,Eye,EyeOff,FileClock,Inbox,LockKeyhole,LogOut,Menu,MessageCircle,Package,Plus,RefreshCcw,Search,Settings,ShieldCheck,ShoppingBag,Tag,Trash2,Users,X} from 'lucide-react';
import {isBackendConfigured,roleAllowed,sectionAllowed,STAFF_SECTIONS,staffApi,csvExport} from './services/staffApi.js';
import StaffOverview from './StaffOverview.jsx';
import {categoryList} from './catalog.js';

const iconMap={overview:ShieldCheck,products:Package,orders:ShoppingBag,conversations:MessageCircle,promotions:Tag,team:Users,settings:Settings,audit:FileClock};
const stockOptions=['all','low','hidden'];
const orderStatuses=['new','processing','shipped','delivered','cancelled'];
const blankProduct={brand:'',name:'',category:'Serums',size:'30ml',price:0,stock:0,active:true,image:''};
const blankPromo={promoLabel:'',promoLine:'',promoType:'promotion',productId:'',discountPercent:0,priority:1,active:false};
const blankInvite={name:'',email:'',role:'admin'};
const usd=value=>value!=null&&Number.isFinite(Number(value))?'$'+Number(value).toFixed(2):'—';
const titleCase=x=>String(x||'').replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());
const dateLabel=x=>{if(!x)return '—';const d=new Date(x);return Number.isNaN(d.getTime())?'—':d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})};
function StateTag({value}){let state=String(value??'unknown');const c=['active','delivered','paid','resolved'].includes(state)?'good':['open','new','pending','processing','shipped','cod-not-paid'].includes(state)?'waiting':['cancelled','hidden','out-of-stock','inactive'].includes(state)?'bad':'neutral';return <span className={'s48-tag '+c}>{titleCase(state)}</span>}
function ActionIcon({title,onClick,children,disabled}){return <button type="button" title={title} aria-label={title} onClick={onClick} disabled={disabled} className="s48-icon-btn">{children}</button>}
function Empty({children='No records available from the backend.'}){return <div className="s48-empty"><Inbox size={21}/>{children}</div>}
function Modal({title,children,onClose}){useEffect(()=>{const esc=e=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',esc);return()=>document.removeEventListener('keydown',esc)},[onClose]);return <div className="staff-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="staff-modal s48-modal" role="dialog" aria-modal="true" aria-label={title}><header><div><small>SECURE STORE MANAGEMENT</small><h2>{title}</h2></div><ActionIcon title="Close" onClick={onClose}><X size={20}/></ActionIcon></header>{children}</section></div>}
function exportRecords(rows,section){if(!rows.length)return;const blob=new Blob(['\ufeff'+csvExport(rows)],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`lurnlurn-${section}.csv`;a.click();URL.revokeObjectURL(url)}

export default function StaffApp({role}){
  const [user,setUser]=useState(null),[booting,setBooting]=useState(isBackendConfigured);
  const [email,setEmail]=useState(''),[password,setPassword]=useState('');
  const [tab,setTab]=useState('overview'),[rows,setRows]=useState([]),[busy,setBusy]=useState(false),[loading,setLoading]=useState(false);
  const [error,setError]=useState(''),[toast,setToast]=useState(''),[search,setSearch]=useState(''),[stockFilter,setStockFilter]=useState('all');
  const [mobileOpen,setMobileOpen]=useState(false),[editor,setEditor]=useState(null),[draft,setDraft]=useState({});
  const [activeChat,setActiveChat]=useState(null),[reply,setReply]=useState(''),[refreshToken,setRefreshToken]=useState(0);
  const noticeRef=useRef(null);
  const allowed=Boolean(user&&roleAllowed(role,user.role));
  const sections=STAFF_SECTIONS[role]||[];
  const secureError=useCallback(e=>{setError(e?.message||'Unable to load server data.');if(e?.status===401||e?.status===403)setUser(null)},[]);
  const notify=useCallback(message=>{setToast(message);clearTimeout(noticeRef.current);noticeRef.current=setTimeout(()=>setToast(''),3500)},[]);
  useEffect(()=>()=>clearTimeout(noticeRef.current),[]);
  useEffect(()=>{
    if(!isBackendConfigured)return;
    let live=true;
    staffApi.me().then(u=>{if(live)setUser(u)}).catch(e=>{if(live&&e.status!==401){setError(e.message)}}).finally(()=>{if(live)setBooting(false)});
    return()=>{live=false};
  },[]);
  const refresh=useCallback(()=>setRefreshToken(n=>n+1),[]);
  const navigate=useCallback(next=>{if(sectionAllowed(role,next)){setTab(next);setMobileOpen(false);setSearch('');setEditor(null);setActiveChat(null)}},[role]);
  useEffect(()=>{
    if(!allowed||tab==='overview')return;
    let live=true;setLoading(true);setError('');
    staffApi.list(tab).then(items=>{if(live)setRows(items)}).catch(e=>{if(live){setRows([]);secureError(e)}}).finally(()=>{if(live)setLoading(false)});
    return()=>{live=false};
  },[allowed,tab,refreshToken,secureError]);
  async function signIn(e){e.preventDefault();if(!isBackendConfigured)return;setBusy(true);setError('');
    try{await staffApi.login({email:email.trim(),password});const verified=await staffApi.me();setPassword('');
      if(!verified)throw Error('The server did not return a signed-in user.');
      setUser(verified);
      if(roleAllowed(role,verified.role)){setTab('overview');notify('Secure session established')}else setError(`This account is assigned role “${verified.role||'none'}” and cannot access the ${titleCase(role)} workspace.`);
    }catch(e){secureError(e)}finally{setBusy(false)}
  }
  async function signOut(){setBusy(true);try{await staffApi.logout()}catch(e){setError(e.message)}finally{setUser(null);setRows([]);setTab('overview');setPassword('');setBusy(false)}}
  const visible=useMemo(()=>rows.filter(row=>{
    if(tab==='products'&&stockFilter==='low'&&Number(row.stock)>5)return false;
    if(tab==='products'&&stockFilter==='hidden'&&row.active!==false)return false;
    return !search.trim()||JSON.stringify(row).toLowerCase().includes(search.toLowerCase().trim());
  }),[rows,tab,search,stockFilter]);
  function openEditor(item=null,mode='edit'){
    if(!['products','promotions','orders','team','settings'].includes(tab))return;
    const empty=tab==='products'?blankProduct:tab==='promotions'?blankPromo:tab==='team'?blankInvite:{};
    setEditor({mode,id:item?.id??null});setDraft(item?{...item}:{...empty});setError('');
  }
  async function save(e){e.preventDefault();if(!editor||!allowed)return;setBusy(true);setError('');
    try{
      const form={...draft};delete form.id;
      if(tab==='products'){
        if(!form.name?.trim()||!form.brand?.trim())throw Error('Brand and name are required.');
        form.price=Number(form.price);form.stock=Number(form.stock);
        if(!Number.isFinite(form.price)||form.price<0||!Number.isInteger(form.stock)||form.stock<0)throw Error('Enter a valid price and non-negative whole stock.');
      }
      if(tab==='promotions'){
        form.discountPercent=Number(form.discountPercent);form.priority=Number(form.priority);form.productId=Number(form.productId);
        if(!Number.isFinite(form.discountPercent)||form.discountPercent<0||form.discountPercent>90)throw Error('Discount must be between 0 and 90%.');
      }
      if(tab==='orders'){
        // Payment status is intentionally NOT mutable from this screen.
        const status=form.status||'new';if(!orderStatuses.includes(status))throw Error('Invalid order status.');
        await staffApi.update('orders',editor.id,{status});
      } else if(tab==='team'&&editor.mode!=='new'){
        if(role!=='super_admin')throw Error('Super Admin required');
        await staffApi.update('team',editor.id,{role:form.role,status:form.status});
      } else if(tab==='team'&&editor.mode==='new'){
        if(role!=='super_admin')throw Error('Super Admin required');
        if(!form.email?.trim())throw Error('Email is required');
        await staffApi.invite({email:form.email.trim(),name:form.name,role:form.role||'admin'});
      } else if(editor.mode==='new')await staffApi.create(tab,form);
      else await staffApi.update(tab,editor.id,form);
      setEditor(null);notify('Saved by backend');refresh();
    }catch(e){secureError(e)}finally{setBusy(false)}
  }
  async function quickUpdate(section,id,changes){if(!allowed)return;setBusy(true);try{await staffApi.update(section,id,changes);notify('Updated successfully');refresh()}catch(e){secureError(e)}finally{setBusy(false)}}
  async function removeItem(section,id){if(!window.confirm('Remove this record?'))return;setBusy(true);try{await staffApi.remove(section,id);notify('Removed successfully');refresh()}catch(e){secureError(e)}finally{setBusy(false)}}
  async function sendReply(e){e.preventDefault();if(!reply.trim()||!activeChat)return;setBusy(true);
    try{await staffApi.reply(activeChat,reply.trim());setReply('');notify('Reply sent via backend');refresh()}catch(e){secureError(e)}finally{setBusy(false)}
  }
  const chat=rows.find(c=>String(c.id)===String(activeChat));

  if(booting)return <div className="s48-boot"><span className="s48-spinner"/><h2>Verifying secure access</h2><p>Checking your session with the backend…</p></div>;
  if(!allowed)return <div className="staff-auth-layout s48-auth-layout"><aside className="staff-auth-art"><img src="/brand-logo-cut.png" alt="LurnLurn emblem"/><h1>LurnLurn<br/><em>Skincare.</em></h1><p>{role==='super_admin'?'Super Admin':'Admin'} workspace</p><span>CREATED FOR YOUR STORE · PROTECTED BY YOUR BACKEND</span></aside><main className="staff-auth-main"><div className="staff-auth-content s48-auth-content"><span className="staff-kicker">SECURE STAFF ACCESS / {role==='super_admin'?'02':'01'}</span><h2>Welcome back.</h2><p>Sign in using the email and password provided by your backend administrator. No demo access is available.</p>
    {!isBackendConfigured&&<div className="s48-no-api"><LockKeyhole size={21}/><div><strong>Backend not connected</strong><span>Set <code>VITE_API_BASE_URL</code> and restart or rebuild the website to enable login. No account can enter until then.</span></div></div>}
    {user&&!allowed&&<div className="staff-error" role="alert">This account does not have permission for the {titleCase(role)} dashboard. <button onClick={signOut}>Sign out</button></div>}
    {error&&<div className="staff-error" role="alert">{error}</div>}
    <form className="staff-auth-form s48-login-form" onSubmit={signIn}><label>Email address<input type="email" autoComplete="username" placeholder="Your backend-provisioned email" value={email} onChange={e=>setEmail(e.target.value)} required disabled={!isBackendConfigured||busy}/></label><label>Password<input type="password" autoComplete="current-password" placeholder="Your account password" value={password} onChange={e=>setPassword(e.target.value)} required disabled={!isBackendConfigured||busy}/></label><button className="staff-primary" type="submit" disabled={!isBackendConfigured||busy}>{busy?'Verifying…':'Secure sign in'} <ArrowRight size={17}/></button></form>
    <div className="staff-auth-footer"><a href="/">Visit storefront</a><a href={role==='super_admin'?'/admin.html':'/super-admin.html'}>Other staff workspace</a></div><p className="s48-login-hint">Accounts and roles are created and verified by the server. Passwords are never stored in this frontend.</p>
  </div></main></div>;
  return <div className="staff-app s48-app"><aside className={'staff-sidebar '+(mobileOpen?'open':'')}><div className="staff-logo"><img src="/brand-logo-cut.png" alt=""/><span>LURNLURN<small>SKINCARE / TEAM</small></span><ActionIcon title="Close menu" onClick={()=>setMobileOpen(false)}><X size={18}/></ActionIcon></div><div className="staff-workspace-label">{role==='super_admin'?'SUPER ADMIN CONSOLE':'STORE ADMIN CONSOLE'}</div><nav aria-label="Admin sections">{sections.map(section=>{const Icon=iconMap[section];return <button key={section} className={tab===section?'active':''} aria-current={tab===section?'page':undefined} onClick={()=>navigate(section)}><Icon size={19}/><span>{titleCase(section)}</span>{tab===section&&<ArrowRight size={15}/>}</button>})}</nav><div className="staff-sidebar-bottom"><div className="staff-demo-note">SERVER CONNECTED<small>Access granted by backend role</small></div><button onClick={signOut} disabled={busy}><LogOut size={17}/> Sign out</button><a href="/" target="_blank" rel="noreferrer">View store <ArrowRight size={16}/></a></div></aside>
  {mobileOpen&&<button className="staff-mobile-overlay" aria-label="Close menu" onClick={()=>setMobileOpen(false)}/>}
  <div className="staff-body"><header className="staff-topbar"><div className="staff-topbar-left"><ActionIcon title="Open navigation" onClick={()=>setMobileOpen(true)}><Menu size={19}/></ActionIcon><span>Workspace <ArrowRight size={14}/> <strong>{titleCase(tab)}</strong></span></div><div className="staff-user"><span className="staff-pill">LIVE API</span><span className="staff-avatar">{(user.name||'A')[0].toUpperCase()}</span><div><b>{user.name||'Team member'}</b><small>{titleCase(user.role)}</small></div></div></header>
  <main className="staff-content"><div className="staff-page-heading"><div><span className="staff-kicker">LURNLURN / {role==='super_admin'?'CONTROL CENTER':'STORE OPERATIONS'}</span><h1>{tab==='overview'?'Dashboard overview':titleCase(tab)}</h1><p>{tab==='overview'?'An overview of backend-verified store activity.':`Manage ${tab} using your connected backend.`}</p></div><div className="staff-heading-actions"><button className="staff-outline" disabled={busy} onClick={refresh}><RefreshCcw size={16}/> Refresh</button>{['products','promotions','team'].includes(tab)&&<button className="staff-primary" disabled={busy} onClick={()=>openEditor(null,'new')}><Plus size={16}/>{tab==='team'?'Invite member':`New ${tab==='products'?'product':'campaign'}`}</button>}</div></div>
  {error&&<div className="staff-error" role="alert">{error}<button onClick={()=>setError('')}>Dismiss</button></div>}{toast&&<div className="staff-success" role="status"><Check size={16}/>{toast}</div>}
  {tab==='overview'?<StaffOverview role={role} refreshToken={refreshToken} onGo={navigate} onError={secureError}/>:<div className="s48-workspace" key={tab}>
  <div className="staff-toolbar"><label className="staff-toolbar-search"><Search size={17}/><input aria-label={`Search ${tab}`} value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${tab}…`}/></label>{tab==='products'&&<select aria-label="Stock filter" value={stockFilter} onChange={e=>setStockFilter(e.target.value)}>{stockOptions.map(s=><option key={s} value={s}>{s==='low'?'Low / out of stock':s==='hidden'?'Hidden products':'All products'}</option>)}</select>}<button className="staff-outline" disabled={!visible.length} onClick={()=>exportRecords(visible,tab)}><ArrowDownToLine size={16}/> Export CSV</button><span className="staff-row-count">{loading?'Loading…':`${visible.length} items`}</span></div>
  {tab==='products'&&<div className="staff-table-scroll"><table className="staff-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visible.map(p=><tr key={p.id}><td><div className="staff-product-cell"><img src={p.image||'/product-photo-pending.svg'} alt="" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src='/product-photo-pending.svg'}}/><span><b>{p.name}</b><small>{p.brand} · #{p.id}</small></span></div></td><td>{p.category}</td><td>{usd(p.price)}</td><td><b className={p.stock<=5?'staff-low':''}>{p.stock}</b></td><td><StateTag value={p.active===false?'hidden':p.stock===0?'out-of-stock':'active'}/></td><td><div className="staff-table-actions"><ActionIcon title="Edit product" onClick={()=>openEditor(p)}><Edit3 size={17}/></ActionIcon><ActionIcon title={p.active===false?'Show product':'Hide product'} disabled={busy} onClick={()=>quickUpdate('products',p.id,{active:p.active===false})}>{p.active===false?<Eye size={17}/>:<EyeOff size={17}/>}</ActionIcon></div></td></tr>)}</tbody></table>{!visible.length&&!loading&&<Empty/>}</div>}
  {tab==='orders'&&<div className="staff-table-scroll"><table className="staff-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Fulfillment</th><th>Actions</th></tr></thead><tbody>{visible.map(o=><tr key={o.id}><td><b>{o.id}</b></td><td>{o.customer?.name||'—'}</td><td>{dateLabel(o.createdAt)}</td><td>{usd(o.totals?.total)}</td><td><StateTag value={o.paymentStatus}/></td><td><StateTag value={o.status}/></td><td><button className="staff-link" onClick={()=>openEditor(o)}>Review <ArrowRight size={15}/></button></td></tr>)}</tbody></table>{!visible.length&&!loading&&<Empty/>}</div>}
  {tab==='conversations'&&<div className="staff-conversations"><div className="staff-chat-list">{visible.map(c=><button key={c.id} className={String(activeChat)===String(c.id)?'active':''} onClick={()=>setActiveChat(c.id)}><span className="staff-chat-avatar">{(c.name||'C')[0].toUpperCase()}</span><span><b>{c.name||'Customer'}</b><small>{c.subject||c.channel||'Conversation'}</small></span><StateTag value={c.status||'open'}/></button>)}{!visible.length&&<Empty/>}</div><div className="staff-chat-detail">{chat?<><header><div><b>{chat.name||'Customer'}</b><small>{chat.channel} · {chat.id}</small></div><button className="staff-outline" onClick={()=>quickUpdate('conversations',chat.id,{status:chat.status==='open'?'resolved':'open'})}>{chat.status==='open'?'Resolve':'Reopen'}</button></header><div className="staff-message-feed">{(chat.messages||[]).map((m,i)=><div key={i} className={'staff-message '+(m.from==='staff'?'sent':'received')}><span>{m.text}</span><small>{titleCase(m.from)}</small></div>)}</div><form onSubmit={sendReply}><input aria-label="Reply message" placeholder="Reply through connected backend…" value={reply} onChange={e=>setReply(e.target.value)}/><button type="submit" className="staff-primary" disabled={busy||!reply.trim()}>Send</button></form></>:<Empty>Select a conversation to read messages.</Empty>}</div></div>}
  {tab==='promotions'&&<div className="staff-promos">{visible.map(p=><article key={p.id} className="staff-promo"><div><span className="staff-kicker">{titleCase(p.promoType)}</span><StateTag value={p.active?'active':'hidden'}/></div><h3>{p.promoLabel}</h3><p>{p.promoLine}</p><small>Product #{p.productId} · Priority {p.priority} · {p.discountPercent||0}% discount</small><div className="staff-promo-actions"><button className="staff-outline" onClick={()=>openEditor(p)}>Edit</button><button className="staff-outline" onClick={()=>quickUpdate('promotions',p.id,{active:!p.active})}>{p.active?'Pause':'Activate'}</button><ActionIcon title="Delete campaign" onClick={()=>removeItem('promotions',p.id)}><Trash2 size={17}/></ActionIcon></div></article>)}{!visible.length&&!loading&&<Empty/>}</div>}
  {tab==='team'&&<div className="staff-table-scroll"><table className="staff-table"><thead><tr><th>Team member</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visible.map(p=><tr key={p.id}><td><b>{p.name}</b></td><td>{p.email}</td><td>{titleCase(p.role)}</td><td><StateTag value={p.status}/></td><td><button className="staff-link" onClick={()=>openEditor(p)}>Edit role</button></td></tr>)}</tbody></table>{!visible.length&&!loading&&<Empty/>}</div>}
  {tab==='settings'&&<div className="staff-promos">{visible.map(item=><article className="staff-promo" key={item.id}><span className="staff-kicker">STORE SETTINGS</span><h3>{item.name||item.id}</h3><p>Telegram: {item.telegram||'Not configured'}</p><p>Currency: {item.currency||'USD'}</p><button className="staff-outline" onClick={()=>openEditor(item)}>Edit store details</button></article>)}{!visible.length&&!loading&&<Empty/>}</div>}
  {tab==='audit'&&<div className="staff-table-scroll"><table className="staff-table"><thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Resource</th></tr></thead><tbody>{visible.map((a,i)=><tr key={a.id||i}><td>{dateLabel(a.at||a.createdAt)}</td><td>{a.actor||a.user?.email||'—'}</td><td>{a.action||'—'}</td><td>{a.section||a.target||'—'}</td></tr>)}</tbody></table>{!visible.length&&!loading&&<Empty/>}</div>}
  </div>}
  <p className="staff-footer-note">LurnLurn Skincare · V4.8 · Server-backed only. Every request and permission must be verified by the backend.</p>
  </main></div>
  {editor&&<Modal title={editor.mode==='new'?(tab==='team'?'Invite team member':'Create '+titleCase(tab)):'Edit '+titleCase(tab)} onClose={()=>setEditor(null)}><form className="staff-editor" onSubmit={save}>
    {tab==='products'&&<><label>Product name<input required value={draft.name||''} onChange={e=>setDraft(p=>({...p,name:e.target.value}))}/></label><label>Brand<input required value={draft.brand||''} onChange={e=>setDraft(p=>({...p,brand:e.target.value}))}/></label><div className="staff-form-grid"><label>Category<select value={draft.category||'Serums'} onChange={e=>setDraft(p=>({...p,category:e.target.value}))}>{categoryList.filter(x=>x!=='All').map(x=><option key={x}>{x}</option>)}</select></label><label>Size<input value={draft.size||''} onChange={e=>setDraft(p=>({...p,size:e.target.value}))}/></label><label>Price (USD)<input required type="number" min="0" step="0.01" value={draft.price??0} onChange={e=>setDraft(p=>({...p,price:e.target.value}))}/></label><label>Stock<input required type="number" min="0" step="1" value={draft.stock??0} onChange={e=>setDraft(p=>({...p,stock:e.target.value}))}/></label></div><label>Product image URL<input value={draft.image||''} onChange={e=>setDraft(p=>({...p,image:e.target.value}))}/></label><label className="staff-check"><input type="checkbox" checked={draft.active!==false} onChange={e=>setDraft(p=>({...p,active:e.target.checked}))}/> Active product</label></>}
    {tab==='orders'&&<><p className="staff-muted">Order #{editor.id} · {draft.customer?.name||'Customer'} · {usd(draft.totals?.total)}</p><label>Fulfillment status<select value={draft.status||'new'} onChange={e=>setDraft(p=>({...p,status:e.target.value}))}>{orderStatuses.map(s=><option key={s} value={s}>{titleCase(s)}</option>)}</select></label><p className="s48-security-note">Payment status cannot be changed here. Payment verification must come from the server and payment provider.</p></>}
    {tab==='promotions'&&<><label>Campaign title<input required value={draft.promoLabel||''} onChange={e=>setDraft(p=>({...p,promoLabel:e.target.value}))}/></label><label>Copy<textarea rows="3" value={draft.promoLine||''} onChange={e=>setDraft(p=>({...p,promoLine:e.target.value}))}/></label><div className="staff-form-grid"><label>Type<select value={draft.promoType||'promotion'} onChange={e=>setDraft(p=>({...p,promoType:e.target.value}))}>{['discount','bestseller','trending','promotion'].map(v=><option key={v} value={v}>{titleCase(v)}</option>)}</select></label><label>Product ID<input required type="number" min="1" value={draft.productId||''} onChange={e=>setDraft(p=>({...p,productId:e.target.value}))}/></label><label>Discount %<input type="number" min="0" max="90" value={draft.discountPercent??0} onChange={e=>setDraft(p=>({...p,discountPercent:e.target.value}))}/></label><label>Priority<input type="number" min="1" value={draft.priority??1} onChange={e=>setDraft(p=>({...p,priority:e.target.value}))}/></label></div><label className="staff-check"><input type="checkbox" checked={draft.active===true} onChange={e=>setDraft(p=>({...p,active:e.target.checked}))}/> Active</label></>}
    {tab==='team'&&<><label>Name<input value={draft.name||''} onChange={e=>setDraft(p=>({...p,name:e.target.value}))}/></label><label>Email<input required type="email" value={draft.email||''} onChange={e=>setDraft(p=>({...p,email:e.target.value}))} disabled={editor.mode!=='new'}/></label><label>Role<select value={draft.role||'admin'} onChange={e=>setDraft(p=>({...p,role:e.target.value}))}><option value="admin">Admin</option><option value="super_admin">Super Admin</option></select></label>{editor.mode!=='new'&&<label>Status<select value={draft.status||'active'} onChange={e=>setDraft(p=>({...p,status:e.target.value}))}><option value="active">Active</option><option value="inactive">Inactive</option></select></label>}<p className="s48-security-note">The backend creates identities/invites, checks permissions, and securely provisions passwords. This UI never sets or stores a team member password.</p></>}
    {tab==='settings'&&<><label>Store name<input value={draft.name||''} onChange={e=>setDraft(p=>({...p,name:e.target.value}))}/></label><label>Telegram username<input value={draft.telegram||''} onChange={e=>setDraft(p=>({...p,telegram:e.target.value}))}/></label><label>Support email<input type="email" value={draft.supportEmail||''} onChange={e=>setDraft(p=>({...p,supportEmail:e.target.value}))}/></label><label>Announcement<input value={draft.announcement||''} onChange={e=>setDraft(p=>({...p,announcement:e.target.value}))}/></label></>}
    <footer className="staff-modal-actions"><button type="button" className="staff-outline" onClick={()=>setEditor(null)}>Cancel</button><button className="staff-primary" disabled={busy} type="submit">{busy?'Saving…':tab==='team'&&editor.mode==='new'?'Send invitation':'Save changes'} <Check size={17}/></button></footer>
  </form></Modal>}
  </div>;
}
