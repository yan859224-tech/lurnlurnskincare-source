/** Demo editorial ads: not sales/analytics claims. Switch to GET /public/promotions when backend is connected. */
export function makePromotions(items=[],campaigns=null){
  if(Array.isArray(campaigns)){return campaigns.filter(x=>x.active!==false).sort((a,b)=>Number(a.priority||99)-Number(b.priority||99)).map(x=>{const p=items.find(p=>String(p.id)===String(x.productId));return p?{...p,...x,stock:p.stock,image:p.image}:null}).filter(Boolean)}
  const featured=[
    {id:4,promoType:'discount',promoLabel:'DEMO DISCOUNT',promoLine:'Skincare ritual offer · sample price only',discountPercent:15},
    {id:1,promoType:'bestseller',promoLabel:'BESTSELLER PICK',promoLine:'A curated favorite · not measured store sales',discountPercent:null},
    {id:113,promoType:'trending',promoLabel:'TRENDING DISCOVERY',promoLine:'Featured product · not measured sales data',discountPercent:null},
    {id:102,promoType:'promotion',promoLabel:'FEATURED COLLECTION',promoLine:'Discover barrier care · example promotion',discountPercent:null},
  ];
  return featured.map(x=>{const p=items.find(p=>p.id===x.id);return p?{...p,...x,stock:p.stock,image:p.image}:null}).filter(Boolean)
}
