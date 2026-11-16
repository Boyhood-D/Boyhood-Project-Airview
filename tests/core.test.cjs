const { test } = require('node:test');
const assert = require('node:assert/strict');
const C = require('../src/core.cjs');
test('great-circle distance, dateline and inverse movement',()=>{
  assert.ok(Math.abs(C.distance([0,0],[0,1])-60.04)<.1);
  assert.ok(C.distance([0,179.9],[0,-179.9])<13);
  const p=C.destination(47,8,90,60);assert.ok(Math.abs(C.distance([47,8],p)-60)<.001);
  assert.ok(C.destination(0,179.9,90,60)[1]<0);
});
test('ADS-B missing values are unknown, zero and ground are preserved',()=>{
  const data=C.normalizeAdsb({ac:[{hex:'ABC123',lat:0,lon:0,seen_pos:0,gs:0,alt_baro:'ground'},{hex:'abc234',lat:1,lon:1,seen_pos:1,flight:' TEST '},{hex:'bad',lat:null,lon:0,seen_pos:0},{hex:'old',lat:1,lon:1,seen_pos:100}]},100000);
  assert.equal(data.length,2);assert.equal(data[0].altitude,0);assert.equal(data[0].speed,0);assert.equal(data[0].ground,true);assert.equal(data[1].altitude,null);assert.equal(data[1].callsign,'TEST');assert.equal(data[1].observedAt,99000);
});
test('OpenSky converts SI units, rejects stale and null positions',()=>{
  const row=['abc',' SWR42 ','Switzerland',100,100,0,0,1000,false,100,90,2,null,1000,'1000',false,0];
  const list=C.normalizeOpenSky({time:100,states:[row,[...row.slice(0,5),null,0]]},110000);
  assert.equal(list.length,1);assert.ok(Math.abs(list[0].altitude-3280.84)<.01);assert.ok(Math.abs(list[0].speed-194.3844)<.01);assert.equal(list[0].callsign,'SWR42');
  assert.equal(C.normalizeOpenSky({time:200,states:[row]},200000).length,0);
  assert.deepEqual(C.normalizeOpenSky({time:100,states:null}),[]);assert.throws(()=>C.normalizeOpenSky({bad:true}));
});
test('combined filters, favorites, missing altitude and emergency',()=>{
  const list=[{id:'a',callsign:'SWR42',model:'A320',altitude:20000,speed:400,ground:false,squawk:'7700'},{id:'b',callsign:'TEST',altitude:null,speed:10,ground:true}];
  assert.equal(C.filterAircraft(list,{search:'swr',minAltitude:10000,maxAltitude:30000,minSpeed:100,airborne:true,emergency:true},[]).length,1);
  assert.equal(C.filterAircraft(list,{favorites:true},['b'])[0].id,'b');assert.equal(C.filterAircraft(list,{minAltitude:1000}).length,1);assert.equal(C.filterAircraft(list,{search:'<script>'}).length,0);
});
test('trails deduplicate reports, retain observed timestamps and expire',()=>{
  const tracks=new Map();const a={id:'a',lat:1,lon:2,observedAt:1000,altitude:0};C.mergeTracks(tracks,[a],1000);C.mergeTracks(tracks,[a],2000);assert.equal(tracks.get('a').length,1);
  C.mergeTracks(tracks,[{...a,lat:2,observedAt:3000}],3000);assert.equal(tracks.get('a').length,2);C.mergeTracks(tracks,[],2000000);assert.equal(tracks.size,0);
});
test('CSV escapes quotes, lines and formula injection',()=>{
  const output=C.csv([{id:'=1+1',callsign:'A"B\nC',altitude:0}]);assert.ok(output.includes('"\'=1+1"'));assert.ok(output.includes('"A""B\nC"'));assert.ok(output.includes('"0"'));
});
test('normalizers fail closed on provider schema errors',()=>{assert.throws(()=>C.normalizeAdsb({aircraft:[]}));assert.throws(()=>C.normalizeAdsb(null));assert.equal(C.validPosition(NaN,0),false);assert.equal(C.validPosition(90,180),true);});
