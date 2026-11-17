(function(root){
 'use strict';
 function flightPhase(a,{now=Date.now(),airport=null,previous=null}={}){
  const result=(code,label,reason,confidence='indicative')=>({code,label,reason,confidence});
  if(!a||!Number.isFinite(a.observedAt)||now-a.observedAt>90000)return result('unknown','Données anciennes','Dernière position trop ancienne pour estimer la phase.','inconnue');
  if(a.ground===true){
   if(previous&&previous.ground===false&&a.observedAt>previous.observedAt&&a.observedAt-previous.observedAt<=180000&&airport?.distance<3&&a.speed>20)return result('ground','Atterrissage probable','Transition vol → sol, vitesse supérieure à 20 kt et proximité d’un aérodrome. Piste et aéroport réels non confirmés.');
   if(!Number.isFinite(a.speed))return result('ground','Au sol','État au sol transmis ; vitesse inconnue.','état transmis');
   if(a.speed<=3)return result('ground','Au sol · immobile','État au sol transmis et vitesse sol ≤ 3 kt.','état transmis');
   return result('ground',a.speed<60?'Roulage probable':'Déplacement rapide au sol','État au sol transmis ; cette vitesse ne permet pas de confirmer la piste ou une phase de décollage / atterrissage.');
  }
  let rate=a.verticalRate,derived=false;
  if(!Number.isFinite(rate)&&previous&&Number.isFinite(previous.altitude)&&Number.isFinite(a.altitude)){
   const dt=(a.observedAt-previous.observedAt)/1000;
   if(dt>=15&&dt<=180){rate=(a.altitude-previous.altitude)*60/dt;derived=true;}
  }
  const altitudeKnown=Number.isFinite(a.altitude),near=airport&&Number.isFinite(airport.distance)&&airport.distance<12,agl=altitudeKnown&&near&&Number.isFinite(airport.elevation)?a.altitude-airport.elevation:null;
  const transition=previous&&previous.ground&&a.observedAt-previous.observedAt>0&&a.observedAt-previous.observedAt<=180000;
  const basis=derived?'Variation de l’altitude entre deux relevés.':'Variomètre transmis.';
  if(Number.isFinite(rate)&&rate>300){
   if(transition&&near&&airport.distance<3&&agl!==null&&agl>=-200&&agl<2000)return result('climb','Décollage probable','Transition sol → vol, montée et proximité d’un aérodrome. Piste et aéroport réels non confirmés.');
   return result('climb','Montée',basis+' Plus de +300 ft/min.');
  }
  if(Number.isFinite(rate)&&rate< -300){
   if(near&&agl!==null&&agl>=-200&&agl<3000)return result('descent','Approche probable',basis+' Descente à moins de 12 NM d’un aérodrome, sous 3 000 ft au-dessus de son élévation. Destination non confirmée.');
   return result('descent','Descente',basis+' Moins de −300 ft/min.');
  }
  if(Number.isFinite(rate)&&Math.abs(rate)<=300){
   if(altitudeKnown&&a.altitude>=18000&&Number.isFinite(a.speed)&&a.speed>=200)return result('stable','Croisière probable',basis+' Vol proche du palier, altitude ≥ 18 000 ft et vitesse ≥ 200 kt. Phase non fournie par la source.');
   return result('stable','Vol stabilisé',basis+' Variation verticale comprise entre −300 et +300 ft/min ; la mission de l’appareil reste inconnue.');
  }
  return result('unknown','Phase indéterminée','Données verticales insuffisantes ; aucune phase déduite de la seule altitude.','inconnue');
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={flightPhase};else root.AirviewFlightPhase={flightPhase};
})(typeof window!=='undefined'?window:globalThis);
