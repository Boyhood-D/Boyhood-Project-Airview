import {camera,vector} from './globe-math.cjs';
import {sunPosition} from './orbital.cjs';
let texture;
onmessage=({data:m})=>{
 if(m.type==='texture'){texture=m;return;}
 if(m.type!=='render')return;
 const size=448,pixels=new Uint8ClampedArray(size*size*4),c=camera(m.lat,m.lon),sun=sunPosition(new Date(m.time)),light=vector(sun.lat,sun.lon),half=size/2;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=(x+.5-half)/half,v=(half-y-.5)/half,r=u*u+v*v;if(r>1)continue;const z=Math.sqrt(1-r),nx=u*c.right[0]+v*c.up[0]+z*c.front[0],ny=u*c.right[1]+v*c.up[1]+z*c.front[1],nz=u*c.right[2]+v*c.up[2]+z*c.front[2];
  const lon=Math.atan2(nz,nx),lat=Math.asin(Math.max(-1,Math.min(1,ny))),dot=nx*light[0]+ny*light[1]+nz*light[2],shade=m.night?.14+.86*Math.max(0,Math.min(1,(dot+.08)/.3)):.85+.15*z;
  let red=34,green=83,blue=112;if(texture){const tx=Math.min(texture.width-1,Math.floor((lon/Math.PI+1)*.5*texture.width)),ty=Math.min(texture.height-1,Math.floor((.5-lat/Math.PI)*texture.height)),i=(ty*texture.width+tx)*4;red=texture.pixels[i];green=texture.pixels[i+1];blue=texture.pixels[i+2];}
  const i=(y*size+x)*4;pixels[i]=red*shade;pixels[i+1]=green*shade;pixels[i+2]=blue*shade;pixels[i+3]=255;
 }
 postMessage({type:'surface',id:m.id,size,pixels},[pixels.buffer]);
};
