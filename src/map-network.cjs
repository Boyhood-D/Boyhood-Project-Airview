'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),maps=require('./map-data.cjs');
const WEEK=7*86400000,MAX_BYTES=128*1024*1024;
function createMapService({fetcher=fetch,now=Date.now}={}){
 const pending=new Map(),blocked=new Map();let active=0,waiters=[],maintenance=0;
 async function prune(dir){try{const files=await fs.readdir(dir,{withFileTypes:true});let size=0,items=[];for(const f of files){if(!f.name.endsWith('.json'))continue;const file=path.join(dir,f.name),s=await fs.stat(file);size+=s.size;items.push({file,size:s.size,mtime:s.mtimeMs});}for(const f of items.sort((a,b)=>a.mtime-b.mtime)){if(size<=MAX_BYTES)break;if(now()-f.mtime<WEEK)continue;await fs.unlink(f.file);size-=f.size;}}catch{}}
 async function tile(q,dataDir){
  if(!maps.valid(q))return {ok:false,message:'Invalid map tile.'};
  const key=`${q.provider}-${q.z}-${q.x}-${q.y}`,dir=path.join(dataDir,'map-tiles'),file=path.join(dir,key+'.json');
  if(pending.has(key))return pending.get(key);
  const work=(async()=>{
   let cached;try{cached=JSON.parse(await fs.readFile(file,'utf8'));if(cached.expires>now())return {ok:true,...cached,cached:true};}catch{}
   const blockedUntil=blocked.get(q.provider)||0;if(blockedUntil>now())return cached?{ok:true,...cached,stale:true}:{ok:false,retryAfter:Math.ceil((blockedUntil-now())/1000),message:'Basemap temporarily unavailable.'};
   if(active>=4)await new Promise(resolve=>waiters.push(resolve));active++;
   try{
    if((blocked.get(q.provider)||0)>now())return cached?{ok:true,...cached,stale:true}:{ok:false,message:'Map service paused.'};
    const headers={'User-Agent':'Airview/2.1.2 (+https://github.com/Boyhood-D/Boyhood-Project-Airview)'};
    if(cached?.etag)headers['If-None-Match']=cached.etag;if(cached?.modified)headers['If-Modified-Since']=cached.modified;
    const response=await fetcher(maps.url(q),{headers,signal:AbortSignal.timeout(12000),redirect:'error'});
    if(response.status===403||response.status===429){const retry=response.status===403?86400:Math.max(60,Number(response.headers.get('retry-after'))||120);blocked.set(q.provider,now()+retry*1000);throw Error('Provider limit');}
    if(response.status!==304&&!response.ok)throw Error('Map HTTP '+response.status);
    const ttl=Math.max(WEEK,(Number(response.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1])||0)*1000,Date.parse(response.headers.get('expires'))-now()||0);
    let result;if(response.status===304&&cached)result={...cached,expires:now()+ttl};else{
     const mime=response.headers.get('content-type')?.split(';')[0];if(!['image/png','image/jpeg'].includes(mime))throw Error('Invalid tile MIME');
     const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length>2*1024*1024)throw Error('Tile too large');
     result={mime,base64:bytes.toString('base64'),expires:now()+ttl,etag:response.headers.get('etag'),modified:response.headers.get('last-modified')};
    }
    try{await fs.mkdir(dir,{recursive:true});await fs.writeFile(file+'.tmp',JSON.stringify(result));await fs.rename(file+'.tmp',file);if(now()>maintenance){maintenance=now()+3600000;void prune(dir);}}catch{}
    return {ok:true,...result};
   }catch{return cached?{ok:true,...cached,stale:true}:{ok:false,message:'Map unavailable: keeping the simplified basemap.'};}
   finally{active--;waiters.shift()?.();}
  })();pending.set(key,work);try{return await work;}finally{pending.delete(key);}
 }
 return {tile};
}
module.exports={createMapService};
