const {test}=require('node:test'),assert=require('node:assert/strict');
test('HTTPS dates correct a slow PC clock and include cache age',()=>{
 const clock=require('../src/clock.cjs'),headers=new Headers({date:'Tue, 17 Nov 2026 12:00:00 GMT',age:'5'}),received=Date.parse('2026-11-17T11:56:00Z');
 const state=clock.observe(headers,received);assert.equal(state.utcOffset,245000);assert.equal(state.clockSynced,true);assert.deepEqual(clock.observe(new Headers(),received),state);
});
test('OpenSky age uses provider epoch and local monotonic session timestamps',()=>{
 const {normalizeOpenSky}=require('../src/core.cjs'),row=['abcdef','TEST','',1000,1000,0,0,100,false,50,90,0,null,null,null,false,0];
 const a=normalizeOpenSky({time:1005,states:[row]},700000)[0];assert.equal(a.observedAt,695000);assert.equal(a.sourceObservedAt,1000000);
 assert.equal(normalizeOpenSky({time:1100,states:[row]},700000).length,0);
});
