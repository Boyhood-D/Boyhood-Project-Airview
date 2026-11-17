'use strict';
// Shared, independently testable astronomical and display calculations.
function sunPosition(date=new Date()) {
  const d=date.getTime()/86400000-10957.5,r=Math.PI/180;
  const g=(357.529+.98560028*d)*r,L=(280.459+.98564736*d)*r;
  const lambda=L+(1.915*Math.sin(g)+.020*Math.sin(2*g))*r,epsilon=(23.439-.00000036*d)*r;
  const ra=Math.atan2(Math.cos(epsilon)*Math.sin(lambda),Math.cos(lambda));
  const dec=Math.asin(Math.sin(epsilon)*Math.sin(lambda));
  const gmst=(280.46061837+360.98564736629*d)*r;
  return {lat:dec/r,lon:((ra-gmst)/r%360+540)%360-180};
}
function aircraftKind(a) {
  const cat=String(a.category||''),model=String(a.model||'').toUpperCase();
  if(cat==='A7'||cat==='8'||/^(H[0-9]|EC|AS[35]|R22|R44|R66|B06|B47|B407|S76)/.test(model))return 'helicopter';
  if(cat==='B1'||cat==='9')return 'glider';
  if(cat==='B2'||cat==='10')return 'balloon';
  if(cat==='A5'||cat==='6'||/^(A38|B74|A34|B77|B78|A35)/.test(model))return 'heavy';
  if(cat==='A1'||cat==='2'||/^(C1|C2|P28|SR2|DA4)/.test(model))return 'light';
  return 'jet';
}
function approximateEta(distanceNm,speedKt,now=Date.now()) {
  return Number.isFinite(distanceNm)&&distanceNm>=0&&Number.isFinite(speedKt)&&speedKt>60 ? now+distanceNm/speedKt*3600000:null;
}
module.exports={sunPosition,aircraftKind,approximateEta};
