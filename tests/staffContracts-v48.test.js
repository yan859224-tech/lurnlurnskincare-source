import test from 'node:test';
import assert from 'node:assert/strict';
import {roleAllowed,sectionAllowed,normalizeOverview,csvExport,STAFF_SECTIONS} from '../src/services/staffContracts.js';

test('admin and super admin are distinct protected workspaces',()=>{
 assert.equal(roleAllowed('admin','admin'),true);
 assert.equal(roleAllowed('admin','super_admin'),false);
 assert.equal(roleAllowed('super_admin','admin'),false);
 assert.equal(roleAllowed('super_admin','super_admin'),true);
 assert.equal(roleAllowed('admin','customer'),false);
 assert.equal(roleAllowed('admin',undefined),false);
 assert.equal(roleAllowed('root','admin'),false);
});
test('super-only settings, team and audit cannot appear for admin UI',()=>{
 for(const s of ['settings','team','audit']){
  assert.equal(sectionAllowed('admin',s),false);
  assert.equal(sectionAllowed('super_admin',s),true);
 }
 for(const s of STAFF_SECTIONS.admin)assert.equal(sectionAllowed('admin',s),true);
});
test('empty backend overview never produces fake KPI values or fake chart points',()=>{
 const info=normalizeOverview({});
 assert.equal(info.metrics.products,null);
 assert.equal(info.metrics.revenue,null);
 assert.deepEqual(info.series,[]);
 assert.deepEqual(info.recentOrders,[]);
});
test('analytics normalizer accepts only finite non-negative server numbers',()=>{
 const info=normalizeOverview({metrics:{products:24,orders:9,revenue:82.50,conversations:2,lowStock:-1,pendingOrders:'4'},series:[{label:'Mon',revenue:9},{label:'Tue',revenue:18},{label:'bad',revenue:NaN},{label:'neg',revenue:-1}]});
 assert.equal(info.metrics.products,24);
 assert.equal(info.metrics.revenue,82.5);
 assert.equal(info.metrics.lowStock,null);
 assert.equal(info.metrics.pendingOrders,null);
 assert.equal(info.series.length,2);
});
test('CSV export protects spreadsheet formula injection',()=>{
 const csv=csvExport([{name:'=IMPORTXML("x","y")',status:'ok'}]);
 assert.ok(csv.includes("'=IMPORTXML"));
 assert.ok(csv.includes('status'));
});
