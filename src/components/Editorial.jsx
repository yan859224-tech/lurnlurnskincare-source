import React,{useState,useEffect,useMemo,useRef} from "react";
import {ArrowRight,ArrowLeft,ArrowUpRight,MoveUpRight,Pause,Play,X,ChevronRight} from "lucide-react";
const heroCutouts={
 'SKIN1004':'/images/hero-skin1004-clean.webp',
 'Dr. Althea':'/images/hero-dralthea-clean.webp',
};
const marqueeBrands=['Round Lab','SKIN1004','Abib','Dr. Althea','haruharu wonder','numbuzin','COSRX','Anua','Beauty of Joseon','Torriden','Purito'];
export function LogoMarquee(){return <div className="logo-marquee" aria-label="LurnLurnskincare moving wordmark"><div className="logo-marquee-track" aria-hidden="true">{Array.from({length:6},(_,i)=><span key={i}><b>LURNLURN</b> SKINCARE <i>✳</i> <em>your daily skin ritual</em> <i>✳</i></span>)}</div></div>}
export function BrandMarquee({onBrand}){return <section className="brand-marquee-section" aria-label="Browse skincare brands"><div className="brand-marquee-label">THE BRAND EDIT <span>Discover familiar favorites</span></div><div className="brand-marquee-viewport"><div className="brand-marquee-track">{[...marqueeBrands,...marqueeBrands].map((b,i)=><button type="button" onClick={()=>onBrand(b)} key={`${b}-${i}`} aria-label={`Shop ${b}`}>{b}</button>)}</div></div></section>}
function InfiniteLoad({enabled,onLoad}){const ref=useRef(null);useEffect(()=>{if(!enabled||!ref.current)return;const node=ref.current;const obs=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting)onLoad()},{rootMargin:'160px'});obs.observe(node);return()=>obs.disconnect()},[enabled,onLoad]);return enabled?<div ref={ref} className="load-more-trigger"><div className="loading-dots" aria-hidden="true"><span/><span/><span/></div><button onClick={onLoad} type="button">Load more products</button></div>:null}
export function PromoSlider({promos,onShop}){
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false);
 const reduce=useMemo(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
 useEffect(()=>{if(paused||reduce||promos.length<2)return;const timer=setInterval(()=>setIndex(i=>(i+1)%promos.length),3000);return()=>clearInterval(timer)},[paused,reduce,promos.length]);
 useEffect(()=>setIndex(i=>promos.length?Math.min(i,promos.length-1):0),[promos.length]);
 if(!promos.length)return null;
 return <section className="promo-shell" aria-label="Featured campaigns, bestsellers and trending products" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setPaused(false)}}>
 <div className="promo-header"><span className="eyebrow">THE 03 SECOND EDIT</span><span>DEMO ADS · DISCOUNTS · BESTSELLER PICKS · TRENDING</span></div>
 <div className="promo-stage" aria-live="off">{promos.map((x,i)=>
 <div className={'promo-slide '+(index===i?'is-active':'')} key={x.id} aria-hidden={index!==i}>
 <div className="promo-copy"><span className="promo-counter">0{i+1} / 0{promos.length}</span>
 <span className="eyebrow">{x.promoLabel||'EDITORIAL PICK'}</span>
 <h2>{x.promoType==='discount'?<>A little more <em>glow.</em></>:x.promoType==='bestseller'?<>The daily <em>favorite.</em></>:x.promoType==='trending'?<>On our <em>radar.</em></>:<>Feel-good <em>skin rituals.</em></>}</h2>
 <p><b>{x.brand}</b> · {x.name}</p>
 <p className="promo-description">{x.promoLine||'Curated skincare inspiration.'}</p>
 {x.discountPercent&&<span className="promo-demo-discount">{x.discountPercent}% example discount · not a live offer</span>}
 <button className="btn dark" onClick={()=>onShop(x)} tabIndex={index===i?0:-1}>Discover product <ArrowRight size={17}/></button></div>
 <div className="promo-art" style={{background:x.color}}><span className="promo-orbit" aria-hidden="true"/><img src={x.image} alt={index===i?`${x.brand} ${x.name}`:''} loading={i===0?'eager':'lazy'} onError={e=>{e.currentTarget.src='/product-photo-pending.svg';e.currentTarget.onerror=null}}/><span className="promo-art-label">LurnLurn · {x.promoType||'featured'} · {x.size} · {x.stock>0?'In stock (demo)':'Out of stock'}</span></div></div>)}</div>
 <div className="promo-bottom"><div className="promo-dots" aria-label="Choose feature">{promos.map((x,i)=><button type="button" key={x.id} aria-label={`Go to slide ${i+1}`} aria-current={index===i?'true':undefined} className={index===i?'current':''} onClick={()=>setIndex(i)}><span/></button>)}</div>
 <div className="promo-controls"><button type="button" aria-label="Previous slide" onClick={()=>setIndex(i=>(i-1+promos.length)%promos.length)}><ArrowLeft size={17}/></button><button type="button" aria-label={paused?'Resume slideshow':'Pause slideshow'} onClick={()=>setPaused(x=>!x)}>{paused?<Play size={17}/>:<Pause size={17}/>}</button><button type="button" aria-label="Next slide" onClick={()=>setIndex(i=>(i+1)%promos.length)}><ArrowRight size={17}/></button></div></div></section>
}


// Original editorial adaptations of the two supplied motion references.
// The product imagery and words below belong to the LURNLURN demo, not the reference brands.
export function FloatingEditorialHero({items,onShop,onQuiz}){
 const lineup=[items.find(p=>p.brand==='SKIN1004'),items.find(p=>p.brand==='Round Lab'),items.find(p=>p.brand==='Dr. Althea')].filter(Boolean);
 return <section className="cinematic-hero" aria-label="Discover the LURNLURN skincare collection">
  <div className="cinematic-topline"><span>CURATED K-BEAUTY · CAMBODIA</span><span>THE LURNLURN EXPERIENCE — 01</span></div>
  <div className="cinematic-ribbon" aria-hidden="true">A MORE CONSIDERED KIND OF GLOW</div>
  <div className="cinematic-disc" aria-hidden="true"><span>RITUALS</span></div>
  <div className="cinematic-copy"><span className="eyebrow">THE SOFT SCIENCE OF SELF-CARE</span><h1>GOOD SKIN.<br/><em>GREAT FEELING.</em></h1><p>A fresh perspective on skincare. Real Korean favorites, beautifully edited for your everyday ritual.</p><div className="cinematic-actions"><button className="btn dark" onClick={onShop}>Discover the collection <ArrowUpRight size={18}/></button><button className="cinematic-quiet" onClick={onQuiz}>About Us <ArrowRight size={16}/></button></div></div>
  {lineup.map((p,i)=><div className={'cinematic-bottle bottle-'+i} key={p.id}><div className="bottle-shadow"/><img src={heroCutouts[p.brand]||p.image} alt={`${p.brand} ${p.name}`} onError={e=>{e.currentTarget.style.opacity=0}} loading={i===0?'eager':'lazy'} /><span className="bottle-caption">{p.brand}</span></div>)}
  <div className="cinematic-bottom"><span>✳ YOUR SKIN, YOUR STORY</span><span>SCROLL TO EXPLORE ↓</span></div>
 </section>
}
export function ProductGalleryStream({items,onOpen}){
 const columns=[items.filter((_,i)=>i%2===0).slice(0,5),items.filter((_,i)=>i%2===1).slice(0,5)];
 return <section className="editorial-gallery" aria-label="Moving skincare product gallery" data-reveal>
   <div className="gallery-story"><span className="eyebrow">THE DAILY EDIT / 2026</span><h2>Little rituals.<br/><em>Big feelings.</em></h2><p>Meet the serums, creams and soothing formulas that make space for self-care.</p><button className="gallery-cta" onClick={()=>onOpen(items[0])}>Meet the collection <ArrowUpRight size={18}/></button><div className="gallery-story-bottom">YOUR EVERYDAY SKIN JOURNAL <span>✳</span> LurnLurnskincare</div></div>
   <div className="gallery-stream" aria-label="Featured real product examples">{columns.map((col,i)=><div className={'gallery-column stream-'+i} key={i}><div className="gallery-moving">{[...col,...col].map((p,j)=><button type="button" key={`${p.id}-${j}`} className="gallery-tile" onClick={()=>onOpen(p)} tabIndex={j>=col.length?-1:0} aria-hidden={j>=col.length?'true':undefined} style={{background:p.color}}><img loading="lazy" src={p.image} alt={j>=col.length?'':p.name} onError={e=>{e.currentTarget.style.display='none'}}/><span>{p.brand}<small>{p.name}</small><small>{p.stock>0?"In stock · demo":"Out of stock · demo"}</small></span></button>)}</div></div>)}</div>
 </section>
}
export function CategoryEditorial({items,onOpen,onCategory}){
 const [active,setActive]=useState('Serums');
 const tabs=['Serums','Toners','Moisturizers','Sunscreens'];
 const matched=items.filter(p=>p.category===active);
 const shown=matched.length>0?matched.slice(0,4):items.slice(0,4);
 return <section className="editorial-products container section" data-reveal><div className="editorial-head"><div><span className="eyebrow">THE PRODUCT ATELIER</span><h2>Find your kind<br/>of <em>glow.</em></h2></div><p>Explore the feel-good essentials, one intentional step at a time. Product prices are demo examples.</p></div>
   <div className="atelier-tabs" role="tablist" aria-label="Explore product categories">{tabs.map(t=><button key={t} role="tab" aria-selected={active===t} className={active===t?'selected':''} onClick={()=>setActive(t)}>{t}</button>)}</div>
   <div className="atelier-lineup" key={active}>{shown.map((p,i)=><button key={p.id} type="button" className="atelier-product" style={{'--item':i,'--tile-color':p.color}} onClick={()=>onOpen(p)}><span className="atelier-number">0{i+1} / {active.toUpperCase()}</span><img src={p.image} loading="lazy" alt={`${p.brand} ${p.name}`} onError={e=>{e.currentTarget.style.opacity=0}}/><strong>{p.brand}</strong><small>{p.name}</small><small>{p.stock>0?"In stock · demo":"Out of stock · demo"}</small><span className="atelier-arrow"><ArrowUpRight size={17}/></span></button>)}</div>
   <button className="text-link atelier-all" onClick={()=>onCategory(active)}>View all {active.toLowerCase()} <ArrowRight size={18}/></button>
 </section>
}
export function ImmersiveMenu({onClose,onGo}){
 const links=[['home','Home'],['shop','Shop'],['concerns','Skin concerns'],['about','Our story'],['contact','Contact'],['admin','Admin dashboard']];
 return <div className="immersive-menu" role="dialog" aria-modal="true" aria-label="Explore LurnLurnskincare"><div className="immersive-top"><span className="immersive-mark">LURNLURN <b>SKINCARE</b> ✳</span><button type="button" onClick={onClose}>CLOSE <X size={18}/></button></div><span className="immersive-orbit" aria-hidden="true">✳</span><nav aria-label="Immersive site navigation">{links.map(([page,label],i)=><button style={{'--item':i}} key={page} onClick={()=>onGo(page)}><span>{label}</span><ArrowUpRight size={31}/></button>)}</nav><div className="immersive-bottom"><span>SKIN FIRST. ALWAYS.</span><span>CAMBODIA · THE DAILY GLOW</span></div></div>
}
