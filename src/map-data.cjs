/* Shared map geometry. Only visible tiles are requested; no offline-area downloads. */
(function(root){
 'use strict';
 const providers={
  streets:{maxZoom:19,credit:'© OpenStreetMap contributors',link:'osm',note:'Cities, streets and borders · OpenStreetMap'},
  satellite:{maxZoom:14,credit:'EOX::Maps · Sentinel-2 2025 · CC BY-NC-SA 4.0',link:'eox',note:'Global 2025 mosaic · ~10 m/pixel · noncommercial use'},
  swiss:{maxZoom:20,credit:'© swisstopo',link:'swiss',note:'HD aerial imagery · Switzerland coverage only'}
 };
 function valid(q){return !!(q&&Object.hasOwn(providers,q.provider)&&Number.isInteger(q.z)&&q.z>=0&&q.z<=providers[q.provider].maxZoom&&Number.isInteger(q.x)&&q.x>=0&&q.x<2**q.z&&Number.isInteger(q.y)&&q.y>=0&&q.y<2**q.z);}
 function url(q){if(!valid(q))throw new Error('Invalid map tile');const {provider,z,x,y}=q;return provider==='streets'?`https://tile.openstreetmap.org/${z}/${x}/${y}.png`:provider==='satellite'?`https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2025_3857/default/g/${z}/${y}/${x}.jpg`:`https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/${z}/${x}/${y}.jpeg`;}
 function visibleTiles(projection,provider){
  const z=Math.min(providers[provider].maxZoom,Math.max(0,Math.floor(Math.log2(projection.scale/256)))),n=2**z,size=projection.scale/n;
  const left=projection.cx*n-projection.width/2/size,top=projection.cy*n-projection.height/2/size,out=[];
  for(let y=Math.max(0,Math.floor(top));y<Math.min(n,Math.ceil(top+projection.height/size));y++)for(let x=Math.floor(left);x<Math.ceil(left+projection.width/size);x++){
   const xx=((x%n)+n)%n;out.push({provider,z,x:xx,y,key:`${provider}/${z}/${xx}/${y}`,left:(x-left)*size,top:(y-top)*size,size});
  }
  return out.sort((a,b)=>Math.hypot(a.left+a.size/2-projection.width/2,a.top+a.size/2-projection.height/2)-Math.hypot(b.left+b.size/2-projection.width/2,b.top+b.size/2-projection.height/2));
 }
 class AirportIndex{
  constructor(airports){this.cells=new Map();this.major=[];for(const a of airports){const k=Math.floor(a.lat)+':'+Math.floor(a.lon);if(!this.cells.has(k))this.cells.set(k,[]);this.cells.get(k).push(a);if(a.type==='large_airport'||a.type==='medium_airport')this.major.push(a);}}
  visible(p,zoom,selected){
   const candidates=zoom<7?this.major:[];
   if(zoom>=7){const spanX=p.width/p.scale*360/2+1,north=Math.atan(Math.sinh(Math.PI*(1-2*(p.cy-p.height/2/p.scale))))*180/Math.PI,south=Math.atan(Math.sinh(Math.PI*(1-2*(p.cy+p.height/2/p.scale))))*180/Math.PI,lon=p.cx*360-180;
    for(let lat=Math.max(-85,Math.floor(south));lat<=Math.min(85,Math.floor(north));lat++)for(let x=Math.floor(lon-spanX);x<=Math.floor(lon+spanX);x++){const xx=((x+180)%360+360)%360-180;candidates.push(...this.cells.get(lat+':'+xx)||[]);}
   }
   const chosen=[],occupied=new Set(),point=[],spacing=zoom<7?65:zoom<10?26:14;
   for(const a of candidates){if(selected?.id===a.id||zoom<4&&a.type!=='large_airport'||zoom<9&&!['large_airport','medium_airport'].includes(a.type))continue;p.project(a.lat,a.lon,point);if(point[0]<-12||point[1]<-12||point[0]>p.width+12||point[1]>p.height+12)continue;const key=Math.floor(point[0]/spacing)+':'+Math.floor(point[1]/spacing);if(zoom<13&&occupied.has(key))continue;occupied.add(key);chosen.push(a);}
   if(selected)chosen.push(selected);return chosen;
  }
 }
 const api={providers,valid,url,visibleTiles,AirportIndex};if(typeof module!=='undefined')module.exports=api;else root.AirviewMapData=api;
})(typeof window!=='undefined'?window:globalThis);
