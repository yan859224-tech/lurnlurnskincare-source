export const deliveryServices=[
 {id:'jt',name:'J&T Express',price:2.5,eta:'Delivery estimate to be confirmed'},
 {id:'pp',name:'PP Delivery',price:1.5,eta:'Delivery estimate to be confirmed'},
 {id:'vet',name:'VET Express',price:2.0,eta:'Delivery estimate to be confirmed'},
 {id:'zto',name:'ZTO Express',price:3.0,eta:'Delivery estimate to be confirmed'}
];
export const provinces=['Phnom Penh','Siem Reap','Battambang','Kampot','Kandal','Preah Sihanouk','Kampong Cham','Takeo','Kampong Speu','Pursat','Banteay Meanchey','Kampong Thom','Prey Veng','Svay Rieng','Kep','Koh Kong','Kratie','Mondulkiri','Ratanakiri','Stung Treng','Preah Vihear','Pailin','Tboung Khmum','Oddar Meanchey','Kampong Chhnang'];
export const demoPromoCode='GLOW10';
export function calcTotals(cart,delivery,promo){const sub=cart.reduce((sum,p)=>sum+Number(p.price)*p.qty,0);const discount=promo?.toUpperCase()===demoPromoCode?Math.round(sub*.1*100)/100:0;const ship=deliveryServices.find(d=>d.id===delivery)?.price||0;return {sub,discount,ship,total:Math.max(0,Math.round((sub-discount+ship)*100)/100)}}
