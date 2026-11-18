/* Canvas tile renderer with viewport-only scheduling and bounded decoded-image memory. */
(()=>{
 const M=()=>window.AirviewMap,D=window.AirviewMapData,images=new Map(),failures=new Map(),running=new Set();
 let wanted=[],key='',timer,active=0,changedAt=0,status='';
 const bridge=window.radar||{mapTile:q=>fetch('/api/mapTile?'+new URLSearchParams(q)).then(r=>r.json())};
 function message(value){if(status===value)return;status=value;document.getElementById('map-quality').textContent=value;}
 function pump(){
  if(document.hidden)return;
  if(performance.now()-changedAt<155){clearTimeout(timer);timer=setTimeout(pump,160);return;}
  const jobs=[...new Map(wanted.filter(t=>!images.has(t.key)&&!running.has(t.key)&&(failures.get(t.key)||0)<Date.now()).map(t=>[t.key,t])).values()];
  while(active<4&&jobs.length){const t=jobs.shift();active++;running.add(t.key);bridge.mapTile({provider:t.provider,z:t.z,x:t.x,y:t.y}).then(async r=>{
   if(!r.ok)throw Error(r.message);const image=new Image();image.src=`data:${r.mime};base64,${r.base64}`;await image.decode();images.set(t.key,{image,stale:r.stale});while(images.size>128)images.delete(images.keys().next().value);failures.delete(t.key);M().dirty();
  }).catch(()=>{failures.set(t.key,Date.now()+120000);if(failures.size>256)failures.delete(failures.keys().next().value);M().dirty();}).finally(()=>{active--;running.delete(t.key);pump();});}
 }
 function draw(ctx,provider){
  if(!D.providers[provider])return false;
  const p=M().projection(),view=[provider,p.cx,p.cy,p.scale,p.width,p.height].join(':');
  if(view!==key){key=view;wanted=D.visibleTiles(p,provider);changedAt=performance.now();clearTimeout(timer);timer=setTimeout(pump,160);}
  let loaded=0,stale=false;
  for(const t of wanted){const entry=images.get(t.key);if(entry){images.delete(t.key);images.set(t.key,entry);ctx.drawImage(entry.image,t.left,t.top,t.size+.5,t.size+.5);loaded++;stale||=entry.stale;continue;}
   // Reuse already viewed parent tiles while sharper tiles arrive. No prefetch.
   for(let dz=1;dz<=t.z;dz++){const n=2**dz,parent=images.get(`${provider}/${t.z-dz}/${Math.floor(t.x/n)}/${Math.floor(t.y/n)}`);if(!parent)continue;const w=parent.image.width/n;ctx.drawImage(parent.image,(t.x%n)*w,(t.y%n)*w,w,w,t.left,t.top,t.size+.5,t.size+.5);break;}
  }
  const max=D.providers[provider].maxZoom,z=Math.log2(p.scale/256),failed=wanted.some(t=>(failures.get(t.key)||0)>Date.now());
  message(failed?'Fond partiel · connexion indisponible':loaded<wanted.length?'Chargement des détails…':stale?'Carte en cache · connexion indisponible':z>max+.1?'Résolution maximale du fournisseur':D.providers[provider].note);
  return loaded>0;
 }
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)pump();});
 setInterval(()=>{if(failures.size)pump();},30000);
 window.AirviewTiles={draw,changedAt:()=>changedAt};
})();
