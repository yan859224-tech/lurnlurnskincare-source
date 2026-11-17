/**
 * V4.8 production-bound staff API adapter.
 * The backend is solely responsible for authentication, authorization, and data integrity.
 * No demo credentials, roles, product overrides or sessions are stored in the browser.
 */
import {API_BASE,request} from './api.js';

export const isBackendConfigured = Boolean(API_BASE);
export {STAFF_ROLES,STAFF_SECTIONS,roleAllowed,sectionAllowed,normalizeOverview,csvExport} from './staffContracts.js';

function unwrap(payload){return payload?.data ?? payload;}
function listResult(payload){
  const value=unwrap(payload);
  if(Array.isArray(value))return value;
  if(Array.isArray(value?.items))return value.items;
  return [];
}
export const staffApi={
  login:async({email,password})=>request('/auth/login',{method:'POST',body:{email,password}}),
  me:async()=>{const data=unwrap(await request('/auth/me'));return data?.user ?? null;},
  logout:async()=>request('/auth/logout',{method:'POST'}),
  overview:async(range='7d')=>unwrap(await request('/admin/overview?range='+encodeURIComponent(range))),
  list:async(resource)=>listResult(await request('/admin/'+resource)),
  create:async(resource,body)=>unwrap(await request('/admin/'+resource,{method:'POST',body})),
  update:async(resource,id,body)=>unwrap(await request('/admin/'+resource+'/'+encodeURIComponent(String(id)),{method:'PATCH',body})),
  remove:async(resource,id)=>unwrap(await request('/admin/'+resource+'/'+encodeURIComponent(String(id)),{method:'DELETE'})),
  reply:async(conversationId,text)=>unwrap(await request('/admin/conversations/'+encodeURIComponent(String(conversationId))+'/replies',{method:'POST',body:{text}})),
  invite:async(body)=>unwrap(await request('/admin/team/invitations',{method:'POST',body}))
};

