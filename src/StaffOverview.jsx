import React,{useEffect,useId,useMemo,useState} from 'react';
import {ArrowRight,CalendarDays,MessageCircle,Package,ShoppingBag,Tag,TrendingUp,TriangleAlert,Truck,Wallet} from 'lucide-react';
import {normalizeOverview,staffApi} from './services/staffApi.js';

const dollars=v=>typeof v==='number'?'$'+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';
const int=v=>typeof v==='number'?v.toLocaleString('en-US'):'—';
function useCounter(target){
  const [output,setOutput]=useState(target==null?null:0);
  useEffect(()=>{
    if(typeof target!=='number'){setOutput(null);return;}
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){setOutput(target);return;}
    let animationId=0;let start=0;const duration=850;
    const tick=now=>{if(!start)start=now;const t=Math.min(1,(now-start)/duration);const eased=1-(1-t)**3;setOutput(target*eased);if(t<1)animationId=requestAnimationFrame(tick)};
    animationId=requestAnimationFrame(tick);return()=>cancelAnimationFrame(animationId);
  },[target]);return output;
}
function Stat({label,value,icon:Icon,unit='',hint,index=0}){
  const current=useCounter(value);
  return <article className="s48-stat" style={{'--seq':index}}>
    <div className="s48-stat-top"><span>{label}</span><span className="s48-stat-icon"><Icon size={21}/></span></div>
    <strong aria-label={`${label}: ${value==null?'not available':value}`} className="s48-value">{current==null?'—':unit==='$'?dollars(current):int(Math.round(current))}</strong>
    <small>{hint}</small><div className="s48-stat-glow" aria-hidden="true"/>
  </article>;
}
function RevenueChart({points,range,changeRange}){
  const id=useId().replaceAll(':','');
  const [active,setActive]=useState(-1);
  const {line,fill,dots,max}=useMemo(()=>{
    if(!points.length)return {line:'',fill:'',dots:[],max:0};
    const values=points.map(p=>p.revenue);
    const ymax=Math.max(1,...values)*1.12;
    const coords=points.map((p,i)=>({x:points.length===1?50:i/(points.length-1)*100,y:88-p.revenue/ymax*73,label:p.label,value:p.revenue}));
    const line=coords.map((p,i)=>(i?'L':'M')+p.x.toFixed(2)+' '+p.y.toFixed(2)).join(' ');
    return {line,fill:`${line} L ${coords.at(-1).x} 100 L ${coords[0].x} 100 Z`,dots:coords,max:ymax};
  },[points]);
  return <section className="s48-panel s48-chart-panel">
    <div className="s48-panel-head"><div><span className="s48-kicker">REVENUE ANALYTICS</span><h2>Revenue performance</h2><p>Amounts supplied and verified by your backend</p></div>
      <div className="s48-range" role="group" aria-label="Chart time range">{['7d','30d'].map(r=><button key={r} type="button" aria-pressed={range===r} className={range===r?'active':''} onClick={()=>changeRange(r)}>{r==='7d'?'7 days':'30 days'}</button>)}</div>
    </div>
    {points.length?<><div className="s48-chart-frame" role="img" aria-label={`Revenue chart with ${points.length} reported data points`}>
      <div className="s48-y-labels"><span>{dollars(max)}</span><span>{dollars(max/2)}</span><span>$0</span></div>
      <svg className="s48-graph" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4B9674" stopOpacity=".25"/><stop offset="1" stopColor="#4B9674" stopOpacity="0"/></linearGradient></defs>
        {[20,52,84].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y} className="s48-gridline" vectorEffect="non-scaling-stroke"/>) }
        <path d={fill} fill={`url(#${id}-fade)`} className="s48-area"/>
        <path key={range+'-'+line} d={line} fill="none" stroke="#398F65" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" pathLength="1" className="s48-line"/>
      </svg>
      <div className="s48-chart-hotspots">{dots.map((p,i)=><button key={`${i}-${p.label}`} className="s48-chart-point" style={{left:`${p.x}%`,top:`${p.y}%`}} aria-label={`${p.label}: ${dollars(p.value)}`} onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(-1)} onFocus={()=>setActive(i)} onBlur={()=>setActive(-1)}><span/></button>)}</div>
      {active>=0&&dots[active]&&<div className="s48-chart-tooltip" style={{left:`${Math.min(78,Math.max(2,dots[active].x))}%`,top:`${Math.max(2,dots[active].y-28)}%`}}><b>{dollars(dots[active].value)}</b><small>{dots[active].label}</small></div>}
      </div><div className="s48-axis">{points.filter((_,i)=>i===0||i===points.length-1||i===Math.floor((points.length-1)/2)).map((p,i)=><span key={i}>{p.label}</span>)}</div></>:<div className="s48-blank-chart"><TrendingUp size={32}/><strong>No chart data yet</strong><span>When the backend returns daily revenue points, an animated chart will appear here.</span></div>}
  </section>;
}
function fmtDate(x){if(!x)return '—';const date=new Date(x);return Number.isNaN(date.getTime())?'—':date.toLocaleDateString('en-GB',{day:'2-digit',month:'short'});}
export default function StaffOverview({role,refreshToken,onGo,onError}){
  const [range,setRange]=useState('7d');
  const [payload,setPayload]=useState(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{let live=true;setLoading(true);
    staffApi.overview(range).then(v=>{if(live)setPayload(normalizeOverview(v))}).catch(e=>{if(live){setPayload(null);onError(e)}}).finally(()=>{if(live)setLoading(false)});
    return()=>{live=false};
  },[range,refreshToken]);
  const m=payload?.metrics||{};
  const counts=[
    {label:'Total products',value:m.products,icon:Package,hint:'Live catalog items'},
    {label:'Orders',value:m.orders,icon:ShoppingBag,hint:`${m.pendingOrders??'—'} awaiting action`},
    {label:'Verified revenue',value:m.revenue,icon:Wallet,unit:'$',hint:'Paid orders confirmed by server'},
    {label:'Open conversations',value:m.conversations,icon:MessageCircle,hint:'Unresolved customer requests'}
  ];
  return <div className={'s48-overview '+(loading?'s48-loading':'')}>
    <div className="s48-stats">{counts.map((c,i)=><Stat key={c.label} {...c} index={i}/>)}</div>
    <div className="s48-overview-grid"><RevenueChart points={payload?.series||[]} range={range} changeRange={setRange}/>
      <section className="s48-panel s48-quick"><div className="s48-panel-head"><div><span className="s48-kicker">OPERATIONS HUB</span><h2>Quick actions</h2><p>Manage your store</p></div></div>
      <div className="s48-quick-list">{[
        {name:'Products & inventory',icon:Package,detail:`${m.lowStock??'—'} low / out of stock`,tab:'products'},
        {name:'Orders & fulfillment',icon:Truck,detail:`${m.pendingOrders??'—'} pending`,tab:'orders'},
        {name:'Promotions',icon:Tag,detail:`${m.activePromotions??'—'} active`,tab:'promotions'},
        ...(role==='super_admin'?[{name:'Staff permissions',icon:CalendarDays,detail:'Super Admin only',tab:'team'}]:[])
      ].map(a=><button key={a.tab} onClick={()=>onGo(a.tab)}><a.icon size={19}/><span><strong>{a.name}</strong><small>{a.detail}</small></span><ArrowRight size={16}/></button>)}</div>
      </section></div>
      <section className="s48-panel s48-recent"><div className="s48-panel-head"><div><span className="s48-kicker">LATEST ACTIVITY</span><h2>Recent orders</h2></div><button className="s48-text-action" onClick={()=>onGo('orders')}>All orders <ArrowRight size={16}/></button></div>
        {payload?.recentOrders?.length?<div className="s48-table-wrap"><table className="s48-table"><thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>{payload.recentOrders.map(o=><tr key={o.id}><td><b>{o.id}</b></td><td>{o.customer?.name||'—'}</td><td>{fmtDate(o.createdAt)}</td><td>{dollars(o.totals?.total)}</td><td><span className="s48-tag">{o.status||'Unknown'}</span></td></tr>)}</tbody></table></div>:<div className="s48-empty"><TriangleAlert size={19}/> No recent order data from the backend.</div>}
      </section>
      {payload?.updatedAt&&<p className="s48-updated">Data last refreshed: {new Date(payload.updatedAt).toLocaleString()}</p>}
  </div>;
}
