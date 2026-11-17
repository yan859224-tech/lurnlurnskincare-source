import React,{useEffect,useRef,useState} from 'react';
import {MessageCircle,Send,X,Sparkles,ExternalLink,ArrowUpRight,ShoppingBag} from 'lucide-react';
import {chatResponse,chatTopics} from '../chatLogic.js';
import {api,API_BASE} from '../services/api.js';
const opening=(km)=>km?'សួស្តី! 👋 ខ្ញុំជា LurnLurn Guide។ ខ្ញុំអាចជួយរកផលិតផលថែរក្សាស្បែក និងឆ្លើយសំណួរទូទៅ។ តើអ្នកចង់រកអ្វី?':'Hi! 👋 I’m LurnLurn Guide. I can help you browse skincare, explore products, and answer common shop questions. How can I help?';
export default function SkincareChatbot({telegram,lang='en',catalog=[],money,openProduct,go}){
 const [open,setOpen]=useState(false),[input,setInput]=useState('');
 const [messages,setMessages]=useState([]);
 const [contactPrompt,setContactPrompt]=useState(false);
 const [sending,setSending]=useState(false),[sendStatus,setSendStatus]=useState('');
 const bodyRef=useRef(null);const inputRef=useRef(null);const messageSeq=useRef(0);const km=lang==='km';
 useEffect(()=>{if(open&&bodyRef.current)bodyRef.current.scrollTop=bodyRef.current.scrollHeight},[messages.length,open]);
 useEffect(()=>{
   if(!open)return;
   function onEscape(e){if(e.key==='Escape')setOpen(false)}
   window.addEventListener('keydown',onEscape);
   const smallScreen=window.matchMedia('(max-width: 760px)').matches;
   const oldOverflow=document.body.style.overflow;
   if(smallScreen)document.body.style.overflow='hidden';
   return()=>{window.removeEventListener('keydown',onEscape);if(smallScreen)document.body.style.overflow=oldOverflow};
 },[open]);
 const sendMessage=(text)=>{
   const q=String(text||'').trim();if(!q)return;
   const answer=chatResponse(q,catalog,lang);const now=`${Date.now()}-${++messageSeq.current}`;
   setMessages(prev=>[...prev,{id:now+'u',from:'you',text:q},{id:now+'b',from:'bot',text:answer.text,productIds:answer.productIds}]);
   setContactPrompt(Boolean(answer.contact));setInput('');
 };
 const openItem=(item)=>{openProduct(item);setOpen(false)};
 const handoff=async()=>{
   if(!API_BASE)return;
   setSending(true);setSendStatus('');
   try {await api.send({channel:'telegram',message:messages.filter(x=>x.from==='you').map(x=>x.text).slice(-5).join(' | ').slice(0,600),source:'store-chat'});
     setSendStatus(km?'បានផ្ញើសំណើទៅហាង។':'Request sent to store.');
   } catch(error){setSendStatus(km?'មិនអាចផ្ញើបាន សូមប្រើ Telegram Link។':'Unable to relay now. Use the Telegram link instead.');}
   finally{setSending(false)};
 };
 return <div className={`lurn-chat-wrap ${open?"is-open":""}`}>
   {open&&<section className="lurn-chat-panel" role="dialog" aria-modal="true" aria-label={km?'ជំនួយ LurnLurn':'LurnLurn shopping help'}>
     <header className="lurn-chat-head"><div className="lurn-chat-head-icon"><MessageCircle size={21}/></div><div><strong>LurnLurn Guide</strong><small>{km?'ជំនួយទិញទំនិញ · Demo':'Shopping help · Demo assistant'}</small></div><button type="button" aria-label="Close chat" onClick={()=>setOpen(false)}><X size={19}/></button></header>
     <div className="lurn-chat-content" ref={bodyRef} aria-live="polite" aria-relevant="additions text"><div className="lurn-chat-bubble bot"><Sparkles size={14}/><span>{opening(km)}</span></div>
       {messages.map(msg=><div key={msg.id} className={'lurn-chat-entry '+(msg.from==='you'?'mine':'theirs')}><div className={'lurn-chat-bubble '+(msg.from==='you'?'you':'bot')}><span>{msg.text}</span></div>{msg.productIds?.length>0&&<div className="lurn-chat-picks">{msg.productIds.map(id=>{const product=catalog.find(p=>p.id===id);return product?<button type="button" key={id} onClick={()=>openItem(product)} className="lurn-chat-product"><img src={product.image} alt="" loading="lazy"/><span><b>{product.brand}</b><small>{product.name}</small><strong>{money?money(product.price):'$'+product.price} · {product.stock>0?(km?'មានស្តុក (Demo)':'In stock (demo)'):(km?'អស់ស្តុក':'Out of stock')}</strong></span><ArrowUpRight size={14}/></button>:null})}</div>}</div>)}
       {contactPrompt&&<div className="lurn-chat-handoff">{telegram?<a href={telegram} target="_blank" rel="noopener noreferrer"><Send size={16}/>{km?'បន្តទៅ Telegram':'Continue on Telegram'}<ExternalLink size={13}/></a>:<p>{km?'ហាងមិនទាន់កំណត់ Telegram Username ទេ។':'The store has not configured a Telegram username yet.'}</p>}</div>}
     </div>
     <div className="lurn-chat-suggestions" aria-label="Quick suggestions">{chatTopics.map(topic=><button type="button" key={topic.id} onClick={()=>sendMessage(topic.id==='serums'?'serums':topic.id==='sensitive'?'sensitive skin':topic.id==='acne'?'acne':topic.id)}>{km?topic.km:topic.en}</button>)}</div>
     <form className="lurn-chat-compose" onSubmit={e=>{e.preventDefault();sendMessage(input)}}><input ref={inputRef} aria-label={km?'សរសេរសំណួរ':'Ask a question'} placeholder={km?'សួរអំពីផលិតផល…':'Ask about a product…'} maxLength={160} value={input} onChange={e=>setInput(e.target.value)}/><button type="submit" aria-label="Send question" disabled={!input.trim()}><Send size={18}/></button></form>
     <div className="lurn-chat-store-links">{telegram?<a href={telegram} target="_blank" rel="noopener noreferrer"><Send size={15}/>{km?'ជជែកផ្ទាល់ជាមួយហាងក្នុង Telegram':'Chat directly with store on Telegram'}<ExternalLink size={13}/></a>:<small>{km?'សូមបញ្ចូល Telegram Username ក្នុង Admin Settings':'Store Telegram username not configured'}</small>}{API_BASE&&<button disabled={sending||!messages.some(x=>x.from==='you')} type="button" onClick={handoff}>{sending?'Sending…':km?'ផ្ញើសំណួរទៅហាង':'Send questions to store'}</button>}{sendStatus&&<small role="status">{sendStatus}</small>}</div>
     <div className="lurn-chat-footer"><span>{km?'នេះជា Chat Demo មិនមែន AI ឬវេជ្ជបណ្ឌិតទេ':'Local demo helper · Not a human advisor or medical diagnosis'}</span><button type="button" onClick={()=>{go('shop');setOpen(false)}}><ShoppingBag size={13}/>{km?'Shop':'Shop'}</button></div>
   </section>}
   <button type="button" className="lurn-chat-fab" onClick={()=>setOpen(o=>!o)} aria-expanded={open} aria-label={open?'Close LurnLurn chat':'Open LurnLurn chat'}>{open?<X size={21}/>:<MessageCircle size={21}/>}<span>{open?(km?'បិទ':'Close'):(km?'ជជែក?':'Chat?')}</span></button>
 </div>;
}
