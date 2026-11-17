import test from 'node:test';
import assert from 'node:assert/strict';
import {calcTotals,deliveryServices} from '../src/pricing.js';

test('no cart: zero subtotal and shipping if not chosen',()=>{assert.deepEqual(calcTotals([],null,''),{sub:0,discount:0,ship:0,total:0})});
test('cart total includes selected delivery cost',()=>{const result=calcTotals([{price:18,qty:2},{price:23,qty:1}],'jt','');assert.equal(result.sub,59);assert.equal(result.ship,2.5);assert.equal(result.total,61.5)});
test('promotion code GLOW10 is case insensitive and discounts subtotal only',()=>{const r=calcTotals([{price:10,qty:2}],'pp','glow10');assert.equal(r.discount,2);assert.equal(r.ship,1.5);assert.equal(r.total,19.5)});
test('all four couriers exist and have distinct IDs',()=>{assert.deepEqual(deliveryServices.map(x=>x.id),['jt','pp','vet','zto'])});
test('invalid coupon does not discount',()=>{const r=calcTotals([{price:4.75,qty:3}],'vet','OTHER');assert.equal(r.discount,0);assert.equal(r.total,16.25)});
