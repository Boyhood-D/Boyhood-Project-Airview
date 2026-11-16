/* Airview's shared projection, motion and ranking engine. No DOM dependencies. */
(function(root){
  'use strict';
  const RAD=Math.PI/180,TAU=Math.PI*2;
  const wrap=x=>((x+.5)%1+1)%1-.5;
  function mercator(lat){const p=Math.max(-85,Math.min(85,lat))*RAD;return (1-Math.log(Math.tan(Math.PI/4+p/2))/Math.PI)/2;}
  function createProjection(center,zoom,width,height){
    const scale=256*2**zoom,cx=(center[1]+180)/360,cy=mercator(center[0]);
    return {scale,cx,cy,width,height,project(lat,lon){return [width/2+wrap((lon+180)/360-cx)*scale,height/2+(mercator(lat)-cy)*scale];},
      projectWorld(x,y,out){out[0]=width/2+wrap(x-cx)*scale;out[1]=height/2+(y-cy)*scale;return out;}};
  }
  const prepared=new WeakMap();
  function prepare(a){let p=prepared.get(a);if(p)return p;
    const x=(a.lon+180)/360,y=mercator(a.lat);let dx=0,dy=0;
    if(!a.ground&&a.speed!=null&&a.heading!=null){
      const distance=a.speed*15/3600/3440.065,lat=a.lat*RAD,h=a.heading*RAD;
      const nextLat=Math.asin(Math.sin(lat)*Math.cos(distance)+Math.cos(lat)*Math.sin(distance)*Math.cos(h));
      const nextLon=a.lon*RAD+Math.atan2(Math.sin(h)*Math.sin(distance)*Math.cos(lat),Math.cos(distance)-Math.sin(lat)*Math.sin(nextLat));
      dx=wrap((nextLon/RAD-a.lon)/360)/15;dy=(mercator(nextLat/RAD)-y)/15;
    }
    p={x,y,dx,dy,time:a.observedAt};prepared.set(a,p);return p;
  }
  function position(a,now,predict,out){const p=prepare(a),dt=predict?Math.max(0,Math.min(15,(now-p.time)/1000)):0;out[0]=p.x+p.dx*dt;out[1]=p.y+p.dy*dt;return out;}
  class Motion {
    constructor(){this.entries=new Map();this.tmp=[0,0];}
    ingest(list,now,predict){const keep=new Set();for(const a of list){keep.add(a.id);const prev=this.entries.get(a.id);let from=null;
      if(prev&&now-prev.received<90000){this.at(prev.aircraft,now,predict,this.tmp);from=[...this.tmp];}
      this.entries.set(a.id,{aircraft:a,from,received:now});prepare(a);
    }for(const id of this.entries.keys())if(!keep.has(id))this.entries.delete(id);}
    at(a,now,predict,out){position(a,now,predict,out);const e=this.entries.get(a.id);if(!e||e.aircraft!==a||!e.from||!predict)return out;
      const t=Math.max(0,Math.min(1,(now-e.received)/900)),ease=t*t*(3-2*t);
      out[0]=e.from[0]+wrap(out[0]-e.from[0])*ease;out[1]=e.from[1]+(out[1]-e.from[1])*ease;return out;}
    clear(){this.entries.clear();}
  }
  function rank(list,sort,center,distance){
    if(sort==='distance'){const distances=new Map();for(const a of list)distances.set(a.id,distance(center,[a.lat,a.lon]));return list.slice().sort((a,b)=>distances.get(a.id)-distances.get(b.id));}
    if(sort==='callsign')return list.slice().sort((a,b)=>(a.callsign||a.id).localeCompare(b.callsign||b.id));
    const key=sort==='altitude'?'altitude':'speed';return list.slice().sort((a,b)=>(b[key]??-1)-(a[key]??-1));
  }
  function retainSnapshots(snapshots,maxReports=120000,maxSnapshots=40){let count=snapshots.reduce((sum,s)=>sum+s.aircraft.length,0);while(snapshots.length>1&&(count>maxReports||snapshots.length>maxSnapshots))count-=snapshots.shift().aircraft.length;return count;}
  const api={mercator,createProjection,prepare,position,Motion,rank,retainSnapshots,wrap};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.AirviewEngine=api;
})(typeof window!=='undefined'?window:globalThis);
