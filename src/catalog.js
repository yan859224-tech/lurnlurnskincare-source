import {extraProducts} from './extra-products.js';
import {videoDemoProducts} from './video-demo-products.js';
import {products as baseProducts} from './data.js';
import {realProductPhotos} from './real-product-photos.js';
const verified = {
  1:{benefits:['Helps soothe the look of sensitive or visibly red skin','Provides lightweight hydration and everyday skin comfort'],source:'https://www.skin1004.com/collections/best-sellers/products/skin1004-madagascar-centella-ampoule?variant=40788189773981'},
  2:{benefits:['Helps replenish moisture after cleansing','Provides gentle exfoliation and soothing care'],source:'https://roundlab.com/products/1025-dokdo-toner'},
  4:{benefits:['Lightweight moisture support for sensitive and blemish-prone skin','Helps improve the appearance of post-breakout marks and uneven texture'],source:'https://doctoraltheaglobal.com/products/345-relief-cream'},
  5:{benefits:['Hydrating toner with hyaluronic acid and black rice','Helps skin feel refreshed and comfortable'],source:'https://haruharuwonder.com/products/haruharuwonder-black-rice-hyaluronic-toner-for-sensitive-skin'},
  6:{benefits:['Fermented ingredients help improve the appearance of uneven texture','Niacinamide and ferments support skin radiance and hydration'],source:'https://us.numbuzin.com/products/no-3-skin-softening-serum-1'},
  7:{benefits:['Snail mucin essence provides moisture and supports the skin barrier','Panthenol and allantoin support a soothed-looking finish'],source:'https://www.cosrx.com/products/advanced-snail-96-mucin-power-essence'},
  10:{benefits:['Five types of hyaluronic acid support skin hydration','Contains panthenol and allantoin for moisture and comfort'],source:'https://torriden.us/products/dive-in-serum'}
};
// 39 actual named skincare SKUs; real retail photo references where available. Sample stock only.
const demoOutOfStock=new Set([106,112,23]);
export const catalog=[...baseProducts,...extraProducts,...videoDemoProducts].map(p=>({
  ...p,
  ...(realProductPhotos[p.id]||{}),
  benefits:verified[p.id]?.benefits||p.benefits||[],
  source:verified[p.id]?.source||p.source||realProductPhotos[p.id]?.photoSource||'',
  stock:demoOutOfStock.has(p.id)?0:20,
  inventoryIsDemo:true,
  photoSource:realProductPhotos[p.id]?.photoSource||p.source||'',
}));
export const stockFor=p=>Math.max(0,Math.floor(Number(p?.stock)||0));
export const stockLabel=(p,lang='en')=>stockFor(p)===0?(lang==='km'?'អស់ស្តុក':'Out of stock'):(lang==='km'?'មានក្នុងស្តុក':'In stock');
export const brandList=[...new Set(catalog.map(p=>p.brand))].sort();
export const categoryList=['All','Cleansers','Toners','Serums','Moisturizers','Sunscreens','Masks','Body Care'];
export const concerns=['Acne','Oily','Dry','Sensitive','Barrier'];
