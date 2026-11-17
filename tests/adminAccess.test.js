import test from 'node:test';
import assert from 'node:assert/strict';
import {canOpenAdmin} from '../src/adminAccess.js';
test('Admin access never unlocks on a local demo account or matching email',()=>{
  const u={id:'test',name:'Admin',email:'demo-admin@example.test'};
  assert.equal(canOpenAdmin({backendEnabled:false,user:u,verifiedRole:true}),false);
  assert.equal(canOpenAdmin({backendEnabled:true,user:u,verifiedRole:false}),false);
  assert.equal(canOpenAdmin({backendEnabled:true,user:null,verifiedRole:true}),false);
  assert.equal(canOpenAdmin({backendEnabled:true,user:u,verifiedRole:true}),true);
});
