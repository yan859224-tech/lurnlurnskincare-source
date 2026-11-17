/** Lightweight, entirely local demo replies. No message is sent to any AI or provider. */
export const chatTopics = [
  {id:'acne',en:'Acne-prone skin',km:'ស្បែកមានមុន'},
  {id:'sensitive',en:'Sensitive skin',km:'ស្បែកងាយរំខាន'},
  {id:'serums',en:'Explore serums',km:'រកមើលសេរ៉ូម'},
  {id:'delivery',en:'Delivery options',km:'សេវាដឹកជញ្ជូន'},
  {id:'payment',en:'Payment methods',km:'វិធីបង់ប្រាក់'},
  {id:'contact',en:'Talk to the shop',km:'ទាក់ទងហាង'}
];
const norm=s=>String(s||'').toLowerCase().trim();
export function chatResponse(message,products=[],lang='en') {
  const q=norm(message), km=lang==='km';
  const show=(en,kh)=>km?kh:en;
  if(!q) return {text:show('Choose a topic or ask about a product.','សូមជ្រើសប្រធានបទ ឬសួរអំពីផលិតផល។'),productIds:[]};
  if(/^(hello|hi|hey|សួស្តី|ជំរាបសួរ)/i.test(q)) return {text:show('Hi! I can help you browse skincare products, check demo delivery methods, or find Telegram support.','សួស្តី! ខ្ញុំអាចជួយស្វែងរកផលិតផល និងព័ត៌មានដឹកជញ្ជូន ឬទំនាក់ទំនងតាម Telegram។'),productIds:[]};
  if(/telegram|contact|advisor|agent|support|human|shop|ទាក់ទង|ប្រឹក្សា|អ្នកប្រឹក្សា/.test(q)) return {text:show('You can contact the shop directly on Telegram when the owner configures a username. Use the button below.','អ្នកអាចទាក់ទងហាងតាម Telegram បន្ទាប់ពីម្ចាស់ហាងកំណត់ Username។ សូមចុចប៊ូតុងខាងក្រោម។'),productIds:[],contact:true};
  if(/delivery|shipping|courier|jt\b|j&t|vet|zto|pp delivery|ដឹក|ដឹកជញ្ជូន|សេវាដឹក/.test(q)) return {text:show('At checkout you can select J&T, PP Delivery, VET or ZTO. The displayed delivery fees are demo estimates, not live courier quotes.','នៅ Checkout អ្នកអាចជ្រើស J&T, PP Delivery, VET ឬ ZTO។ តម្លៃដឹកជញ្ជូនជាតម្លៃគំរូ មិនមែនតម្លៃផ្ទាល់ពីក្រុមហ៊ុនទេ។'),productIds:[]};
  if(/payment|visa|aba|khqr|pay|cod|bank|បង់|ទូទាត់/.test(q)) return {text:show('The demo checkout shows COD, ABA KHQR, KHQR and Visa. Real online payment verification is not connected. Never enter real card details into a demo.','Checkout Demo មាន COD, ABA KHQR, KHQR និង Visa ប៉ុន្តែមិនទាន់ភ្ជាប់ប្រព័ន្ធផ្ទៀងផ្ទាត់ការទូទាត់ពិតទេ។ កុំបញ្ចូលព័ត៌មានកាតពិតក្នុង Demo។'),productIds:[]};
  if(/order|checkout|cart|កម្ម៉ង់|កន្ត្រក|ការបញ្ជាទិញ/.test(q)) return {text:show('To test an order, sign in with a demo identity, add products to the cart, choose an address and delivery, then proceed to the demo payment step.','ដើម្បីសាកល្បងកម្ម៉ង់ សូម Login Demo → Add to Cart → ជ្រើសអាសយដ្ឋាន និងការដឹកជញ្ជូន → Payment Demo។'),productIds:[]};
  const concerns=[['Acne',/acne|pimple|blemish|មុន/],['Sensitive',/sensitive|redness|irritation|ស្បែកងាយ|ក្រហម/],['Dry',/dry|dehydrat|hydration|ស្ងួត|សំណើម/],['Oily',/oily|oil|ខ្លាញ់/],['Barrier',/barrier|ceramide|របាំងស្បែក/]];
  for (const [kind,test] of concerns) if(test.test(q)) {
    const picks=products.filter(p=>p.active!==false&&(p.concerns||[]).includes(kind)).slice(0,3);
    return {text:show(`Here are a few ${kind.toLowerCase()}-skin catalog picks. This is general product discovery, not a medical diagnosis.`,`នេះជាផលិតផលគំរូសម្រាប់ ${kind}។ ព័ត៌មាននេះសម្រាប់ស្វែងរកផលិតផលទូទៅ មិនមែនជាការធ្វើរោគវិនិច្ឆ័យទេ។`),productIds:picks.map(p=>p.id)};
  }
  if(/serum|សេរ៉ូម/.test(q)) {
    const picks=products.filter(p=>p.category==='Serums').slice(0,3);
    return {text:show('Explore these serums from the demo catalog.','សូមមើលសេរ៉ូមគំរូខាងក្រោម។'),productIds:picks.map(p=>p.id)};
  }
  const query=q.replace(/[?.,!]/g,'').trim();
  const tokens=query.split(/\s+/).filter(t=>t.length>=3);
  const matches=products.map(p=>({p,score:(norm(p.brand+' '+p.name).includes(query)?100:0)+tokens.filter(t=>norm(p.brand+' '+p.name).includes(t)).length})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,4).map(x=>x.p);
  if(matches.length)return {text:show('Here are the closest matching products. Prices and availability are demo information.','នេះជាផលិតផលដែលត្រូវជាមួយពាក្យស្វែងរក។ តម្លៃ និងស្តុកជាទិន្នន័យ Demo។'),productIds:matches.map(p=>p.id)};
  return {text:show('I could not find a close match. Try a brand name (Anua, AESTURA, Torriden), a concern (acne, dry, sensitive), or tap a quick topic.','ខ្ញុំមិនទាន់រកឃើញផលិតផលត្រូវនឹងសំណួរទេ។ សាកល្បងឈ្មោះម៉ាក (Anua, AESTURA, Torriden) ឬប្រភេទស្បែក (មុន, ស្ងួត, ងាយរំខាន)។'),productIds:[]};
}
