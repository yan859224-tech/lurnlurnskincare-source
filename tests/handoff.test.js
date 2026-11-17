import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('admin and super admin have separate entrypoints',()=>{
 const vite=readFileSync('vite.config.js','utf8');
 assert.match(vite,/admin\.html/); assert.match(vite,/super-admin\.html/);
 assert.match(readFileSync('src/AdminApp.jsx','utf8'),/role="admin"/);
 assert.match(readFileSync('src/SuperAdminApp.jsx','utf8'),/role="super_admin"/);
});
test('telegram bot secrets do not appear in frontend env settings',()=>{
 const env=readFileSync('.env.example','utf8');
 assert.doesNotMatch(env,/^TELEGRAM_BOT_TOKEN=/m);
 assert.doesNotMatch(env,/^TELEGRAM_STORE_CHAT_ID=/m);
});
