const {test}=require('node:test'),assert=require('node:assert/strict');
const {mergeAircraft}=require('../src/network.cjs');
test('cross-source deduplication preserves the freshest complete position and enriches identity',()=>{
 const reports=[{provider:'opensky',aircraft:[{id:'abc123',observedAt:1000,lat:10,lon:20,speed:200,model:'',registration:'',country:'Switzerland'}]},{provider:'adsb',aircraft:[{id:'abc123',observedAt:2000,lat:11,lon:21,speed:null,model:'A320',registration:'HB-TEST',country:''},{id:'def456',observedAt:1900,lat:15,lon:25}]}];
 const result=mergeAircraft(reports,3000);assert.equal(result.length,2);const a=result[0];assert.equal(a.lat,11);assert.equal(a.lon,21);assert.equal(a.speed,null);assert.equal(a.country,'Switzerland');assert.equal(a.model,'A320');assert.deepEqual(a.providers,['opensky','adsb']);assert.equal(reports[1].aircraft[0].country,'');
 assert.equal(mergeAircraft([...reports].reverse(),3000)[0].observedAt,2000);
});
test('combined coverage excludes expired source observations rather than presenting them as current',()=>{
 assert.deepEqual(mergeAircraft([{provider:'opensky',aircraft:[{id:'abc123',observedAt:0}]}],900001),[]);
});
test('combined traffic survives one provider outage and coalesces simultaneous requests',async()=>{
 const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'airview-combined-')),original=global.fetch,api=require('../src/network.cjs');let calls=0;
 global.fetch=async url=>{calls++;await new Promise(resolve=>setTimeout(resolve,5));return url.includes('opensky')?{ok:false,status:503,headers:new Headers()}:{ok:true,headers:new Headers(),json:async()=>({ac:[{hex:'abc123',lat:46,lon:8,seen_pos:1,flight:'TEST123',alt_baro:30000}]})};};
 try{api.configureBudgetDir(dir);const q={provider:'auto',lat:46,lon:8},[a,b]=await Promise.all([api.traffic(q),api.traffic(q)]);assert.ok(a.ok&&b.ok);assert.equal(calls,2);assert.equal(a.aircraft.length,1);assert.equal(a.sources[0].ok,false);assert.equal(a.sources[1].ok,true);await api.traffic(q);assert.equal(calls,2);}finally{global.fetch=original;fs.rmSync(dir,{recursive:true,force:true});}
});
