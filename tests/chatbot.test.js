import test from 'node:test';
import assert from 'node:assert/strict';
import {chatResponse} from '../src/chatLogic.js';
import {catalog,categoryList} from '../src/catalog.js';

test('video references include matched real product-photo links',()=>{
 const demo=catalog.filter(p=>p.videoDemo);
 assert.equal(demo.length,16);
 assert.equal(new Set(catalog.map(p=>p.id)).size,catalog.length);
 assert.ok(demo.every(p=>/^https:\/\//.test(p.image)));
 assert.ok(demo.every(p=>p.photoSource));
 assert.ok(demo.some(p=>p.brand==='ILLIYOON'));
 assert.ok(demo.some(p=>p.brand==='AESTURA'));
 assert.ok(categoryList.includes('Body Care'));
});
test('chat matches exact brand names from demo catalog',()=>{
 const res=chatResponse('AESTURA',catalog,'en');
 assert.ok(res.productIds.includes(102));
});
test('chat responds to acne concern with relevant products',()=>{
 const res=chatResponse('acne',catalog,'en');
 assert.ok(res.productIds.length>0);
 assert.ok(res.productIds.every(id=>catalog.find(p=>p.id===id).concerns.includes('Acne')));
});
test('chat does not claim real checkout status',()=>{
 const res=chatResponse('visa',catalog,'en');
 assert.match(res.text,/demo/i);
});
test('chat contact message supports Telegram handoff',()=>{
 const res=chatResponse('Contact',catalog,'km');
 assert.equal(res.contact,true);
});
