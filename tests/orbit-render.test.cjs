const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('../src/render-engine.cjs');
test('projection can reuse a caller buffer without changing coordinates',()=>{
 const projection=E.createProjection([45,179],4,1200,800),buffer=[0,0];
 for(const p of [[45,-179],[0,0],[-80,170],[85,-180]]){const reference=projection.project(...p);assert.equal(projection.project(...p,buffer),buffer);assert.deepEqual(buffer,reference);}
});
test('orbital interpolation reuses storage, crosses the dateline and clamps time',()=>{
 const a=new Float32Array([10,179,400,7.6]),b=new Float32Array([12,-179,402,7.8]),buffer=[];
 assert.equal(E.interpolateOrbit(a,b,0,.5,buffer),buffer);assert.ok(Math.abs(Math.abs(buffer[1])-180)<.0001);assert.equal(buffer[0],11);assert.equal(buffer[2],401);
 assert.equal(E.interpolateOrbit(a,b,0,5,buffer)[0],12);assert.equal(E.interpolateOrbit(a,b,0,-1,buffer)[0],10);
 assert.deepEqual(E.interpolateOrbit(a,null,0,.5,buffer),Array.from(a));assert.equal(E.interpolateOrbit(new Float32Array([NaN,0,NaN,0]),b,0,0,buffer),null);
});
