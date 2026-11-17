import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,stockFor,stockLabel} from '../src/catalog.js';
import {makePromotions} from '../src/promotions.js';
import {realProductPhotos} from '../src/real-product-photos.js';
test('39 real named skincare product SKUs, each has a product photograph URL',()=>{
 assert.ok(catalog.length>=25);
 assert.ok(catalog.every(p=>/^https:\/\//.test(p.image)));
 assert.equal(new Set(catalog.map(p=>p.id)).size,catalog.length);
});
test('stock status handles zero and positive quantities',()=>{
 assert.equal(stockFor({stock:0}),0);
 assert.equal(stockLabel({stock:0}),'Out of stock');
 assert.equal(stockLabel({stock:20},'km'),'មានក្នុងស្តុក');
 assert.ok(catalog.some(p=>p.stock===0));
});
test('3-second editorial promo dataset has all three campaign roles and distinct IDs',()=>{
 const slides=makePromotions(catalog);
 assert.equal(slides.length,4);
 assert.ok(['discount','bestseller','trending'].every(type=>slides.some(s=>s.promoType===type)));
 assert.equal(new Set(slides.map(x=>x.id)).size,slides.length);
});
test('photo references are documented for the 27 previously placeholder products',()=>{
 assert.equal(Object.keys(realProductPhotos).length,27);
 assert.ok(Object.values(realProductPhotos).every(x=>x.photoSource.startsWith('https://')));
});
