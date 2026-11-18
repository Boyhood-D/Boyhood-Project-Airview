'use strict';
const fs=require('node:fs');
const path=require('node:path');
const clock=require('./clock.cjs');
let catalogPromise=null,blockedUntil=0,catalogMemory=null;
const metaCache=new Map(),boardCache=new Map();
async function json(url) {
  const r=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'Airview/2.2.0 personal observation'}});
  if(!r.ok)throw new Error(`HTTP ${r.status}`);
  clock.observe(r.headers);
  const size=Number(r.headers.get('content-length'));if(size>30000000)throw new Error('Réponse trop volumineuse');
  return r.json();
}
async function satellites(dataDir) {
  if(catalogPromise)return catalogPromise;
  const file=path.join(dataDir,'satellites.json');
  catalogPromise=(async()=>{
    let cached=catalogMemory;
    if(!cached)try{cached=JSON.parse(fs.readFileSync(file,'utf8'));}catch{}
    if(cached&&Date.now()-cached.fetchedAt<7200000)return {ok:true,...cached,...clock.state(),cached:true};
    try{blockedUntil=Math.max(blockedUntil,JSON.parse(fs.readFileSync(path.join(dataDir,'satellite-next.json'),'utf8')).next||0);}catch{}
    if(Date.now()<blockedUntil)return cached?{ok:true,...cached,stale:true,message:'Catalogue en cache ; fournisseur temporairement indisponible.'}:{ok:false,message:'Catalogue orbital temporairement indisponible. Réessaie dans deux heures.'};
    blockedUntil=Date.now()+7200000;
    try{fs.mkdirSync(dataDir,{recursive:true});fs.writeFileSync(path.join(dataDir,'satellite-next.json'),JSON.stringify({next:blockedUntil}));}catch{}
    try {
      const data=await json('https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=JSON');
      if(!Array.isArray(data)||!data.length||data.length>100000||!data.every(s=>s.NORAD_CAT_ID&&s.EPOCH&&Number.isFinite(Number(s.MEAN_MOTION))))throw new Error('Catalogue invalide');
      catalogMemory={fetchedAt:Date.now(),data};
      fs.mkdirSync(dataDir,{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(catalogMemory));fs.renameSync(file+'.tmp',file);
      return {ok:true,...catalogMemory,...clock.state()};
    }catch(e){return cached?{ok:true,...cached,stale:true,message:'Éléments en cache : '+e.message}:{ok:false,message:'Catalogue CelesTrak indisponible : '+e.message};}
  })();
  try{return await catalogPromise;}finally{catalogPromise=null;}
}
async function metadata(query) {
  const id=String(query?.id||'').toLowerCase(),callsign=String(query?.callsign||'').trim().toUpperCase();
  if(!/^[0-9a-f]{6}$/.test(id)||!/^([A-Z0-9]{1,10})?$/.test(callsign))return {ok:false,message:'Identifiant invalide'};
  const key=id+':'+callsign;if(metaCache.has(key))return metaCache.get(key);
  if(metaCache.size>500)metaCache.delete(metaCache.keys().next().value);
  const promise=(async()=>{
    const [aircraft,route]=await Promise.allSettled([
      json('https://api.adsbdb.com/v0/aircraft/'+id),
      callsign?json('https://api.adsbdb.com/v0/callsign/'+callsign):Promise.resolve(null)
    ]);
    return {ok:true,aircraft:aircraft.status==='fulfilled'?aircraft.value?.response?.aircraft:null,route:route.status==='fulfilled'?route.value?.response?.flightroute:null};
  })();metaCache.set(key,promise);return promise;
}
async function airportBoard(query) {
  const airport=String(query?.airport||'').toUpperCase(),direction=query?.direction==='departure'?'departure':'arrival';
  if(!/^[A-Z0-9]{4}$/.test(airport))return {ok:false,message:'Code ICAO à quatre caractères nécessaire.'};
  const end=Math.floor(Date.now()/86400000)*86400,begin=end-86400,key=airport+direction+begin;
  if(boardCache.has(key))return boardCache.get(key);
  if(boardCache.size>100)boardCache.delete(boardCache.keys().next().value);
  const promise=(async()=>{try{return {ok:true,begin,end,flights:await json(`https://opensky-network.org/api/flights/${direction}?airport=${airport}&begin=${begin}&end=${end}`)};}catch(e){return {ok:false,message:`Historique OpenSky non accessible (${e.message}). Les horaires commerciaux et les vols programmés ne sont pas fournis par cette source gratuite.`};}})();
  boardCache.set(key,promise);return promise;
}
module.exports={satellites,metadata,airportBoard};
