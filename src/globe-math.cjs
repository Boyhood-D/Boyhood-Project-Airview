(function(root){
 'use strict';const R=Math.PI/180;
 function camera(lat,lon){const a=lat*R,b=lon*R;return {right:[-Math.sin(b),0,Math.cos(b)],up:[-Math.sin(a)*Math.cos(b),Math.cos(a),-Math.sin(a)*Math.sin(b)],front:[Math.cos(a)*Math.cos(b),Math.sin(a),Math.cos(a)*Math.sin(b)]};}
 function vector(lat,lon,height=0,out=[]){const a=lat*R,b=lon*R,r=1+Math.max(0,height)/6371;out[0]=r*Math.cos(a)*Math.cos(b);out[1]=r*Math.sin(a);out[2]=r*Math.cos(a)*Math.sin(b);return out;}
 function project(v,c,out=[]){out[0]=v[0]*c.right[0]+v[1]*c.right[1]+v[2]*c.right[2];out[1]=v[0]*c.up[0]+v[1]*c.up[1]+v[2]*c.up[2];out[2]=v[0]*c.front[0]+v[1]*c.front[1]+v[2]*c.front[2];return out;}
 function visible(p){return p[2]>=0||p[0]*p[0]+p[1]*p[1]>1;}
 const api={camera,vector,project,visible};if(typeof module!=='undefined')module.exports=api;else root.AirviewGlobeMath=api;
})(typeof window!=='undefined'?window:globalThis);
