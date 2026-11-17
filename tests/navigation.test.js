import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const ui=readFileSync(new URL('../src/components/UI.jsx',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/v4.css',import.meta.url),'utf8');

test('desktop main navigation contains every requested destination and filter icon',()=>{
 for (const route of ['home','shop','concerns','about','promotions','contact'])
  assert.ok(ui.includes(`navigate('${route}')`),`missing ${route}`);
 assert.match(ui,/<SlidersHorizontal size=\{15\}/);
});
test('mobile hamburger includes Filters and opens the shop filter sheet route',()=>{
 assert.match(ui,/navigate\('shop-filters'\)/);
 assert.match(app,/if\(name==='shop-filters'\)return '\/shop\?filters=1'/);
 assert.match(app,/openFilters=\{route\.filters\}/);
});
test('tablet and narrow desktop navigation is displayed, mobile menu remains available',()=>{
 assert.match(css,/@media \(min-width:761px\) and \(max-width:1390px\)/);
 assert.match(css,/grid-template-areas:'brand tools' 'navigation navigation'/);
 assert.match(css,/@media \(max-width:760px\)/);
});
