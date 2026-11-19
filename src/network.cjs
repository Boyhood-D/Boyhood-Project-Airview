'use strict';
const { normalizeAdsb, normalizeOpenSky } = require('./core.cjs');
const clock=require('./clock.cjs');
const fs=require('node:fs');
const nextAllowed = new Map();
const latest = new Map();
let budget=require('./quota.cjs').createBudget();
let cacheDir;
function configureBudgetDir(dir){cacheDir=dir;nextAllowed.clear();latest.clear();budget=require('./quota.cjs').createBudget(require('node:path').join(dir,'traffic-budget.json'));}
function cachePath(provider){return require('node:path').join(cacheDir,'last-traffic-'+provider+'.json');}
async function traffic(query) {
  if(query?.provider==='auto')return combined(query);
  const provider = query && query.provider === 'opensky' ? 'opensky' : 'adsb';
  const lat = Number(query.lat), lon = Number(query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 85 || Math.abs(lon) > 180) throw new Error('Invalid map center.');
  const plan=budget.plan(provider),now = Date.now(), next = Math.max(nextAllowed.get(provider)||0,now+plan.wait*1000);
  const key=provider==='opensky'?provider:`${provider}:${lat.toFixed(4)}:${lon.toFixed(4)}`;
  if(cacheDir&&!latest.has(key))try{const saved=JSON.parse(require('node:fs').readFileSync(cachePath(provider),'utf8'));if(saved.key===key&&saved.result?.ok&&Array.isArray(saved.result.aircraft)&&Date.now()-saved.result.receivedAt<86400000)latest.set(key,saved.result);}catch{}
  if (now < next) {
    const cached=latest.get(key);
    return cached?{...cached,cached:true,retryAfter:Math.ceil((next-now)/1000)}:{ok:false,pending:true,message:'Provider cooldown.',retryAfter:Math.ceil((next-now)/1000)};
  }
  const interval = plan.seconds*1000;
  budget.charge(provider);
  nextAllowed.set(provider, now + interval);
  const url = provider === 'opensky' ? 'https://opensky-network.org/api/states/all?extended=1' : `https://api.adsb.lol/v2/point/${lat.toFixed(4)}/${lon.toFixed(4)}/250`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'Airview/2.3.0 (+https://github.com/Boyhood-D/Boyhood-Project-Airview)' } });
    if (!res.ok) {
      const rawRetry = res.headers.get('retry-after') || res.headers.get('x-rate-limit-retry-after-seconds');
      const parsed = Number(rawRetry), delay = Number.isFinite(parsed) && parsed > 0 ? Math.min(86400, Math.max(interval / 1000, parsed)) : res.status === 429 ? 900 : 60;
      nextAllowed.set(provider, Date.now() + delay * 1000);budget.block(provider,delay);
      return { ok: false, message: res.status === 429 ? 'Public quota reached. Requests resume after the provider cooldown.' : `Provider unavailable (HTTP ${res.status}).`, retryAfter: delay };
    }
    const data = await res.json(), receivedAt = Date.now();budget.observe(provider,res.headers);
    const result={ ok: true, provider, receivedAt, ...clock.observe(res.headers,receivedAt), aircraft: provider === 'adsb' ? normalizeAdsb(data, receivedAt) : normalizeOpenSky(data, receivedAt), quota:budget.plan(provider).remaining, retryAfter:budget.plan(provider).wait, adaptive:true };
    // Keep only the last scope for each source. Switching 2D/3D does not refetch.
    for(const k of latest.keys())if(k.startsWith(provider))latest.delete(k);
    latest.set(key,result);
    if(cacheDir)try{const f=cachePath(provider);fs.mkdirSync(cacheDir,{recursive:true});fs.writeFileSync(f+'.tmp',JSON.stringify({key,result}));fs.renameSync(f+'.tmp',f);}catch{}
    return result;
  } catch (e) {
    console.warn('[Airview] Provider request failed:', e.name, e.cause?.code || e.message);
    return { ok: false, message: e.name === 'TimeoutError' ? 'Provider timed out. Another attempt is scheduled in one minute.' : 'Connection unavailable. Check your network or try later.', retryAfter: 60 };
  }
}
function mergeAircraft(reports,now=Date.now()) {
 const merged=new Map();
 for(const report of reports)for(const a of report.aircraft||[]){if(now-a.observedAt>900000)continue;const old=merged.get(a.id);if(!old){merged.set(a.id,{...a,providers:[report.provider]});continue;}const fresh=a.observedAt>old.observedAt?a:old,other=fresh===a?old:a;const value={...fresh,providers:[...new Set([...old.providers,report.provider])]};for(const key of ['registration','model','country','category','callsign'])if(!value[key]&&other[key])value[key]=other[key];merged.set(a.id,value);}
 return [...merged.values()];
}
let combinedPromise;
async function combined(query){
 if(combinedPromise)return combinedPromise;
 combinedPromise=(async()=>{const results=await Promise.allSettled(['opensky','adsb'].map(provider=>traffic({...query,provider}))),reports=results.filter(r=>r.status==='fulfilled'&&r.value.ok).map(r=>r.value),waits=results.filter(r=>r.status==='fulfilled').map(r=>Math.max(10,r.value.retryAfter||60));
 if(!reports.length)return {ok:false,message:'Public sources unavailable or cooling down. No synthetic traffic is shown.',retryAfter:Math.min(...waits,60)};
 return {ok:true,provider:'auto',receivedAt:Math.max(...reports.map(r=>r.receivedAt)),...clock.state(),aircraft:mergeAircraft(reports),retryAfter:Math.min(...waits),adaptive:true,cached:reports.every(r=>r.cached),sources:results.map((r,i)=>({provider:['opensky','adsb'][i],ok:r.status==='fulfilled'&&r.value.ok,message:r.value?.message||'',receivedAt:r.value?.receivedAt||null}))};})();try{return await combinedPromise;}finally{combinedPromise=null;}
}
module.exports = { traffic,configureBudgetDir,mergeAircraft };

