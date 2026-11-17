import {useEffect,useState} from 'react';
export function readStore(key,fallback){try{const x=localStorage.getItem(key);return x ? JSON.parse(x):fallback}catch{return fallback}}
export function useStored(key,fallback){const [value,setValue]=useState(()=>readStore(key,fallback));useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}},[key,value]);useEffect(()=>{const sync=e=>{if(e.key!==key)return;const next=readStore(key,fallback);setValue(prev=>JSON.stringify(prev)===JSON.stringify(next)?prev:next)};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync)},[key]);return [value,setValue]}
export {deliveryServices,provinces,demoPromoCode,calcTotals} from './pricing.js';
