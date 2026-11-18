(function(root){
 'use strict';
 function flightPhase(a,{now=Date.now(),airport=null,previous=null}={}){
  const result=(code,label,reason,confidence='indicative')=>({code,label,reason,confidence});
  if(!a||!Number.isFinite(a.observedAt)||now-a.observedAt>90000)return result('unknown','Old data','Last position is too old to estimate a flight phase.','unknown');
  if(a.ground===true){
   if(previous&&previous.ground===false&&a.observedAt>previous.observedAt&&a.observedAt-previous.observedAt<=180000&&airport?.distance<3&&a.speed>20)return result('ground','Probable landing','Air-to-ground transition, speed above 20 kt and proximity to an airfield. Actual runway and airport are unconfirmed.');
   if(!Number.isFinite(a.speed))return result('ground','On ground','Ground state reported; speed unknown.','reported state');
   if(a.speed<=3)return result('ground','On ground · stationary','Ground state reported and ground speed at or below 3 kt.','reported state');
   return result('ground',a.speed<60?'Probable taxi':'Fast ground movement','Ground state reported; speed does not confirm a runway or takeoff/landing phase.');
  }
  let rate=a.verticalRate,derived=false;
  if(!Number.isFinite(rate)&&previous&&Number.isFinite(previous.altitude)&&Number.isFinite(a.altitude)){
   const dt=(a.observedAt-previous.observedAt)/1000;
   if(dt>=15&&dt<=180){rate=(a.altitude-previous.altitude)*60/dt;derived=true;}
  }
  const altitudeKnown=Number.isFinite(a.altitude),near=airport&&Number.isFinite(airport.distance)&&airport.distance<12,agl=altitudeKnown&&near&&Number.isFinite(airport.elevation)?a.altitude-airport.elevation:null;
  const transition=previous&&previous.ground&&a.observedAt-previous.observedAt>0&&a.observedAt-previous.observedAt<=180000;
  const basis=derived?'Altitude change between two reports.':'Vertical rate reported.';
  if(Number.isFinite(rate)&&rate>300){
   if(transition&&near&&airport.distance<3&&agl!==null&&agl>=-200&&agl<2000)return result('climb','Probable takeoff','Ground-to-air transition, climb and airfield proximity. Actual runway and airport are unconfirmed.');
   return result('climb','Climb',basis+' Above +300 ft/min.');
  }
  if(Number.isFinite(rate)&&rate< -300){
   if(near&&agl!==null&&agl>=-200&&agl<3000)return result('descent','Probable approach',basis+' Descending within 12 NM of an airfield, below 3,000 ft above its elevation. Destination unconfirmed.');
   return result('descent','Descent',basis+' Below -300 ft/min.');
  }
  if(Number.isFinite(rate)&&Math.abs(rate)<=300){
   if(altitudeKnown&&a.altitude>=18000&&Number.isFinite(a.speed)&&a.speed>=200)return result('stable','Probable cruise',basis+' Near-level flight, altitude at least 18,000 ft and speed at least 200 kt. The source does not provide this phase.');
   return result('stable','Level flight',basis+' Vertical rate between -300 and +300 ft/min; the aircraft mission remains unknown.');
  }
  return result('unknown','Unknown phase','Insufficient vertical data; no phase is inferred from altitude alone.','unknown');
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={flightPhase};else root.AirviewFlightPhase={flightPhase};
})(typeof window!=='undefined'?window:globalThis);
