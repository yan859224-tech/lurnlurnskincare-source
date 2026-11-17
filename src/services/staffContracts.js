/** Pure permission and data-format utilities for staff UI. Backend remains authoritative. */
export const STAFF_ROLES = Object.freeze({admin:['admin'],super_admin:['super_admin']});
export const STAFF_SECTIONS = Object.freeze({
  admin:['overview','products','orders','conversations','promotions'],
  super_admin:['overview','products','orders','conversations','promotions','team','settings','audit']
});
export function roleAllowed(routeRole,serverRole){
  return STAFF_ROLES[routeRole]?.includes(serverRole)===true;
}
export function sectionAllowed(routeRole,section){
  return STAFF_SECTIONS[routeRole]?.includes(section)===true;
}
export function normalizeOverview(payload){
  const data=(payload?.data ?? payload)||{};
  const m=data.metrics||{};
  const pick=(key)=>typeof m[key]==='number'&&Number.isFinite(m[key])&&m[key]>=0?m[key]:null;
  const points=Array.isArray(data.series)?data.series.filter(p=>p&&typeof p.label==='string'&&typeof p.revenue==='number'&&Number.isFinite(p.revenue)&&p.revenue>=0).slice(-31):[];
  return {
    metrics:{products:pick('products'),orders:pick('orders'),revenue:pick('revenue'),conversations:pick('conversations'),lowStock:pick('lowStock'),pendingOrders:pick('pendingOrders'),activePromotions:pick('activePromotions')},
    series:points,
    recentOrders:Array.isArray(data.recentOrders)?data.recentOrders.slice(0,6):[],
    updatedAt:typeof data.updatedAt==='string'?data.updatedAt:null,
  };
}
export function csvExport(rows){
  const columns=[...new Set(rows.flatMap(row=>Object.keys(row).filter(key=>typeof row[key]!=='object')))];
  const cell=value=>{let s=String(value??'');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
  return [columns.map(cell).join(','),...rows.map(row=>columns.map(key=>cell(row[key])).join(','))].join('\r\n');
}
