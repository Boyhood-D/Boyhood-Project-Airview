const { test } = require('node:test');
const assert = require('node:assert/strict');
test('request boundary validates coordinates, normalizes and enforces cooldown', async()=>{
  const original=global.fetch;let calls=0;global.fetch=async url=>{calls++;assert.match(url,/api\.adsb\.lol\/v2\/point\/46\.8000\/8\.2000\/250/);return {ok:true,json:async()=>({ac:[]}),headers:new Headers()};};
  try{const {traffic}=require('../src/network.cjs');await assert.rejects(()=>traffic({lat:999,lon:0}));const first=await traffic({lat:46.8,lon:8.2});assert.equal(first.ok,true);assert.deepEqual(first.aircraft,[]);const second=await traffic({lat:46.8,lon:8.2});assert.equal(second.ok,false);assert.equal(calls,1);}finally{global.fetch=original;}
});
test('429 respects retry delay and reports no synthetic traffic',async()=>{
  const original=global.fetch;global.fetch=async()=>({ok:false,status:429,headers:new Headers({'retry-after':'1800'})});
  try{const {traffic}=require('../src/network.cjs');const result=await traffic({provider:'opensky',lat:0,lon:0});assert.equal(result.ok,false);assert.equal(result.retryAfter,1800);assert.equal(result.aircraft,undefined);}finally{global.fetch=original;}
});

