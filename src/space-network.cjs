'use strict';
const fs=require('node:fs');
const path=require('node:path');
const clock=require('./clock.cjs');
let catalogPromise=null,blockedUntil=0,catalogMemory=null,starterServed=false;
const metaCache=new Map(),boardCache=new Map();
async function json(url) {
  const r=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'Airview/2.3.0 personal observation'}});
  if(!r.ok)throw new Error(`HTTP ${r.status}`);
  clock.observe(r.headers);
  const size=Number(r.headers.get('content-length'));if(size>30000000)throw new Error('Response is too large');
  return r.json();
}
async function satellites(dataDir,{bootstrapFile=path.join(__dirname,'../assets/satellites-bootstrap.json')}={}) {
 if(catalogPromise)return catalogPromise;
 const file=path.join(dataDir,'satellites.json'),nextFile=path.join(dataDir,'satellite-next.json');
 catalogPromise=(async()=>{
  let cached=catalogMemory;
  if(!cached)try{const value=JSON.parse(fs.readFileSync(file,'utf8'));require('./catalog.cjs').validateCatalog(value.data);cached=value;}catch{}
  let starter;try{starter=JSON.parse(fs.readFileSync(bootstrapFile,'utf8'));require('./catalog.cjs').validateCatalog(starter.data);}catch{}
  if(starter&&(!cached||Date.now()-cached.fetchedAt>30*86400000||cached.partial&&starter.fetchedAt>cached.fetchedAt))cached={...starter,bootstrap:true};
  const now=Date.now();if(cached&&now-cached.fetchedAt<7200000&&(!cached.partial||!starterServed)){starterServed=true;catalogMemory=cached;return {ok:true,...cached,...clock.state(),cached:true,retryAfter:cached.partial?900:Math.ceil((7200000-now+cached.fetchedAt)/1000)};}
  try{blockedUntil=Math.max(blockedUntil,JSON.parse(fs.readFileSync(nextFile,'utf8')).next||0);}catch{}
  const fallback=message=>cached&&now-cached.fetchedAt<30*86400000?{ok:true,...cached,...clock.state(),stale:true,message,retryAfter:Math.max(900,Math.ceil((blockedUntil-Date.now())/1000))}:{ok:false,message,retryAfter:Math.max(900,Math.ceil((blockedUntil-Date.now())/1000))};
  if(now<blockedUntil)return fallback('Using the dated orbital cache. Next provider check is scheduled automatically.');
  function reserve(seconds){blockedUntil=Date.now()+seconds*1000;try{fs.mkdirSync(dataDir,{recursive:true});fs.writeFileSync(nextFile,JSON.stringify({next:blockedUntil}));}catch{}}
  async function independentFallback(message){
   if(cached&&(!cached.partial||Date.now()-cached.fetchedAt<86400000))return fallback(message+' Using the dated cache.');
   try{const r=await fetch('https://tle.ivanstanojevic.me/api/tle/?page-size=100',{signal:AbortSignal.timeout(15000),headers:{'User-Agent':'Airview/2.3.0'}});if(!r.ok)throw Error('Fallback HTTP '+r.status);const j=await r.json(),data=require('./catalog.cjs').parseTleRecords(j.member);catalogMemory={fetchedAt:Date.now(),source:'TLE API / Ivan Stanojevic (CelesTrak-derived)',partial:true,total:j.totalItems,data};try{fs.writeFileSync(file,JSON.stringify(catalogMemory));}catch{}return {ok:true,...catalogMemory,...clock.state(),stale:true,message:message+' Limited fallback: '+data.length+' popular objects, not the full catalogue.',retryAfter:Math.max(900,Math.ceil((blockedUntil-Date.now())/1000))};}catch{return fallback(message+' No fallback is currently reachable.');}
  }
  reserve(7200);
  try{
   const r=await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=CSV',{signal:AbortSignal.timeout(25000),redirect:'error',headers:{'User-Agent':'Airview/2.3.0 (+https://github.com/Boyhood-D/Boyhood-Project-Airview)','Accept-Encoding':'gzip, br'}});
   if(!r.ok){const retry=Math.max(900,Number(r.headers.get('retry-after'))||0);reserve(r.status>=500?retry:Math.max(7200,retry));return await independentFallback('CelesTrak returned HTTP '+r.status+'. Requests are paused.');}
   clock.observe(r.headers);const text=await r.text();if(text.length>30000000)throw Error('Orbital response is too large');const data=require('./catalog.cjs').parseCatalog(text);
   catalogMemory={fetchedAt:Date.now(),data,source:'CelesTrak GP / CSV'};reserve(7200);try{fs.mkdirSync(dataDir,{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(catalogMemory));fs.renameSync(file+'.tmp',file);}catch{}
   return {ok:true,...catalogMemory,...clock.state(),retryAfter:7200};
  }catch(e){reserve(900);return await independentFallback('Orbital provider unavailable: '+e.message+'. Requests are paused.');}
 })();try{return await catalogPromise;}finally{catalogPromise=null;}
}
async function metadata(query) {
  const id=String(query?.id||'').toLowerCase(),callsign=String(query?.callsign||'').trim().toUpperCase();
  if(!/^[0-9a-f]{6}$/.test(id)||!/^([A-Z0-9]{1,10})?$/.test(callsign))return {ok:false,message:'Invalid identifier'};
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
  if(!/^[A-Z0-9]{4}$/.test(airport))return {ok:false,message:'A four-character ICAO code is required.'};
  const end=Math.floor(Date.now()/86400000)*86400,begin=end-86400,key=airport+direction+begin;
  if(boardCache.has(key))return boardCache.get(key);
  if(boardCache.size>100)boardCache.delete(boardCache.keys().next().value);
  const promise=(async()=>{try{return {ok:true,begin,end,flights:await json(`https://opensky-network.org/api/flights/${direction}?airport=${airport}&begin=${begin}&end=${end}`)};}catch(e){return {ok:false,message:`OpenSky history unavailable (${e.message}). This free source does not provide commercial schedules or scheduled flights.`};}})();
  boardCache.set(key,promise);return promise;
}
module.exports={satellites,metadata,airportBoard};
