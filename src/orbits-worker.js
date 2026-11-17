import {json2satrec} from '../node_modules/satellite.js/dist/io.js';
import {propagate,gstime} from '../node_modules/satellite.js/dist/propagation.js';
import {eciToGeodetic} from '../node_modules/satellite.js/dist/transforms.js';
let records=[];
function location(record,time) {
  const p=propagate(record,new Date(time));if(!p?.position||typeof p.position!=='object')return null;
  const g=eciToGeodetic(p.position,gstime(new Date(time)));
  if(!Number.isFinite(g.height)||g.height<0)return null;
  return [g.latitude*180/Math.PI,g.longitude*180/Math.PI,g.height,Math.hypot(p.velocity.x,p.velocity.y,p.velocity.z)];
}
onmessage=({data:m})=>{
  if(m.type==='catalog') {
    records=m.data.map(s=>{try{return json2satrec(s);}catch{return null;}});
    postMessage({type:'ready',count:records.length});
  }else if(m.type==='positions') {
    const positions=new Float32Array(records.length*4),nextPositions=new Float32Array(records.length*4);positions.fill(NaN);nextPositions.fill(NaN);
    records.forEach((r,i)=>{if(r)try{const p=location(r,m.time),next=location(r,m.time+5000);if(p)positions.set(p,i*4);if(next)nextPositions.set(next,i*4);}catch{}});
    postMessage({type:'positions',positions,nextPositions,time:m.time},[positions.buffer,nextPositions.buffer]);
  }else if(m.type==='orbit') {
    const r=records[m.index];if(!r)return;
    const period=Math.min(172800,2*Math.PI/r.no*60),points=[];
    for(let i=0;i<=180;i++){try{const p=location(r,m.time+(i/180-.15)*period*1000);if(p)points.push(p);}catch{}}
    postMessage({type:'orbit',points,index:m.index,period});
  }
};
