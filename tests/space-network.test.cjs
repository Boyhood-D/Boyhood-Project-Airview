const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
test('orbital catalogue uses cache and coalesces concurrent fetches',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'airview-test-')),original=global.fetch;let calls=0;
 global.fetch=async()=>{calls++;await new Promise(r=>setTimeout(r,5));return {ok:true,headers:new Headers(),json:async()=>[{NORAD_CAT_ID:25544,EPOCH:'2026-11-17T00:00:00',MEAN_MOTION:15.5}]};};
 try{const {satellites}=require('../src/space-network.cjs');const results=await Promise.all([satellites(dir),satellites(dir)]);assert.equal(calls,1);assert.ok(results.every(r=>r.ok));await satellites(dir);assert.equal(calls,1);assert.ok(fs.existsSync(path.join(dir,'satellites.json')));}finally{global.fetch=original;fs.rmSync(dir,{recursive:true,force:true});}
});
test('metadata and boards reject user-controlled URLs before network',async()=>{
 let calls=0;const original=global.fetch;global.fetch=async()=>{calls++;throw Error('unexpected');};
 try{const api=require('../src/space-network.cjs');assert.equal((await api.metadata({id:'../../secret',callsign:'X'})).ok,false);assert.equal((await api.airportBoard({airport:'https://evil.example'})).ok,false);assert.equal(calls,0);}finally{global.fetch=original;}
});
