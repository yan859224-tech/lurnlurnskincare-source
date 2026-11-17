export const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
export class ApiError extends Error { constructor(message,status){super(message);this.status=status;} }
export async function request(path,{method='GET',body,signal}={}){
 if(!API_BASE)throw new ApiError('Service not connected. Please try again when the store opens.',503);
 const response=await fetch(API_BASE+path,{method,credentials:'include',signal,headers:{'Accept':'application/json',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
 const data=await response.json().catch(()=>null);
 if(!response.ok)throw new ApiError(data?.error?.message||'Unable to complete request. Please retry.',response.status);
 return data;
}
export const api={
 publicProducts:(params={})=>request('/public/products'+(Object.keys(params).length?'?'+new URLSearchParams(params).toString():'')),
 publicPromotions:()=>request('/public/promotions'),
 createOrder:(body)=>request('/orders',{method:'POST',body}),
 me:()=>request('/auth/me'), login:body=>request('/auth/login',{method:'POST',body}),register:body=>request('/auth/register',{method:'POST',body}),logout:()=>request('/auth/logout',{method:'POST'}),
 list:(resource)=>request('/admin/'+resource),save:(resource,id,body)=>request('/admin/'+resource+'/'+encodeURIComponent(id),{method:'PATCH',body}),
 conversations:()=>request('/conversations'),send:(body)=>request('/conversations/messages',{method:'POST',body}),
 oauth(provider){if(!API_BASE)throw new ApiError('Social sign-in is not connected yet.',503);window.location.assign(API_BASE+'/auth/'+provider+'/start');}
};
