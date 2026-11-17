const {test}=require('node:test'),assert=require('node:assert/strict');
const {sunPosition,aircraftKind,approximateEta}=require('../src/orbital.cjs');
test('solar terminator follows solstices and UTC rotation',()=>{
 const summer=sunPosition(new Date('2026-06-21T12:00:00Z')),winter=sunPosition(new Date('2026-12-21T12:00:00Z'));
 assert.ok(summer.lat>23&&summer.lat<24);assert.ok(winter.lat< -23&&winter.lat> -24);assert.ok(Math.abs(summer.lon)<2);
 const evening=sunPosition(new Date('2026-06-21T18:00:00Z'));assert.ok(evening.lon< -88&&evening.lon> -92);
});
test('category-specific symbolic models and unknown types',()=>{
 assert.equal(aircraftKind({category:'8'}),'helicopter');assert.equal(aircraftKind({model:'A388'}),'heavy');assert.equal(aircraftKind({model:'C172'}),'light');assert.equal(aircraftKind({category:'B1'}),'glider');assert.equal(aircraftKind({}),'jet');
});
test('ETA is unknown at missing or taxi speed, geometric otherwise',()=>{
 assert.equal(approximateEta(500,null,0),null);assert.equal(approximateEta(500,15,0),null);assert.equal(approximateEta(500,500,0),3600000);
});
test('SGP4 propagation matches Vallado reference at the epoch',async()=>{
 const {twoline2satrec}=await import('../node_modules/satellite.js/dist/io.js');
 const {sgp4}=await import('../node_modules/satellite.js/dist/propagation.js');
 const sat=twoline2satrec('1 00005U 58002B   00179.78495062  .00000023  00000-0  28098-4 0  4753','2 00005  34.2682 348.7242 1859667 331.7664  19.3264 10.82419157413667');
 const p=sgp4(sat,0).position;assert.ok(Math.abs(p.x-7022.46529266)<.001);assert.ok(Math.abs(p.y+1400.08296755)<.001);assert.ok(Math.abs(p.z-.03995155)<.001);
});
