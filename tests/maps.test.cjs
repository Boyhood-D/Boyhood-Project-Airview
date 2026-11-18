const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const maps=require('../src/map-data.cjs'),{createProjection}=require('../src/render-engine.cjs'),{createMapService}=require('../src/map-network.cjs');
test('tile coordinates wrap at dateline and remain bounded at street zoom',()=>{
 for(const center of [[0,179.99],[0,-179.99],[85,0],[-85,0]])for(const zoom of [1,8,19,20]){
  const p=createProjection(center,zoom,1200,800),tiles=maps.visibleTiles(p,'streets');assert.ok(tiles.length>0&&tiles.length<80);for(const t of tiles)assert.ok(maps.valid(t));
 }
});
test('fixed providers reject path traversal, unsupported levels and foreign URLs',()=>{
 for(const q of [{provider:'../secrets',z:1,x:0,y:0},{provider:'streets',z:20,x:1,y:1},{provider:'streets',z:1,x:-1,y:0},{provider:'satellite',z:1,x:0,y:2},{provider:'swiss',z:1.1,x:0,y:0}])assert.equal(maps.valid(q),false);
 assert.match(maps.url({provider:'satellite',z:3,x:2,y:1}),/\/3\/1\/2.jpg$/);
});
test('airport index includes small fields and heliports at local zoom and selection at any zoom',()=>{
 const points=[{id:'a',lat:46.8,lon:8.2,type:'small_airport'},{id:'h',lat:46.801,lon:8.201,type:'heliport'},{id:'z',lat:0,lon:0,type:'small_airport'}],index=new maps.AirportIndex(points);
 assert.equal(index.visible(createProjection([46.8,8.2],6,1000,800),6).length,0);
 assert.equal(index.visible(createProjection([46.8,8.2],14,1000,800),14).length,2);
 assert.deepEqual(index.visible(createProjection([0,179.9],4,1000,800),4,points[0]),[points[0]]);
});
test('tiles coalesce requests, identify the app and persist cache across service restarts',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'airview-map-test-'));let calls=0;
 try{const fetcher=async(url,opts)=>{calls++;assert.match(opts.headers['User-Agent'],/^Airview\/2.1.2/);return new Response(Buffer.from([137,80,78,71]),{headers:{'content-type':'image/png','cache-control':'max-age=60'}});},service=createMapService({fetcher,now:()=>1000}),q={provider:'streets',z:2,x:2,y:1};
  const [a,b]=await Promise.all([service.tile(q,dir),service.tile(q,dir)]);assert.ok(a.ok&&b.ok);assert.equal(calls,1);assert.ok(a.expires>=1000+7*86400000);
  const second=await createMapService({fetcher,now:()=>2000}).tile(q,dir);assert.ok(second.cached);assert.equal(calls,1);
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
test('provider denial stops subsequent requests and never caches HTML as imagery',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'airview-map-test-'));let calls=0;
 try{const service=createMapService({fetcher:async()=>{calls++;return new Response('denied',{status:403});}});
  assert.equal((await service.tile({provider:'swiss',z:2,x:1,y:1},dir)).ok,false);assert.equal((await service.tile({provider:'swiss',z:2,x:2,y:1},dir)).ok,false);assert.equal(calls,1);
  const html=createMapService({fetcher:async()=>new Response('<html/>',{headers:{'content-type':'text/html'}})});assert.equal((await html.tile({provider:'streets',z:1,x:0,y:0},dir)).ok,false);
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
