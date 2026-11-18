/* Download public assets at build time; no remote scripts or map subscription. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dest=path.resolve(__dirname,'../assets');
const sources={
 'earth.jpg':'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
 'elevation.jpg':'https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/topography/gebco_08_rev_elev_5400x2700.jpg',
 'airports.csv':'https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv'
};
function csv(text){const rows=[];let row=[],field='',quote=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quote&&text[i+1]==='"'){field+='"';i++;}else quote=!quote;}else if(c===','&&!quote){row.push(field);field='';}else if(c==='\n'&&!quote){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';}else field+=c;}if(field||row.length){row.push(field);rows.push(row);}return rows;}
async function main(){
 const manifest={};
 const seedPath=path.join(dest,'satellites-bootstrap.json');if(!fs.existsSync(seedPath)){
 const r=await fetch('https://tle.ivanstanojevic.me/api/tle/?page-size=100',{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'Airview/2.2.1 build'}});if(!r.ok)throw Error('Orbital starter download failed: HTTP '+r.status);const j=await r.json(),data=require('../src/catalog.cjs').parseTleRecords(j.member);fs.writeFileSync(seedPath,JSON.stringify({fetchedAt:Date.now(),source:'TLE API / Ivan Stanojevic (CelesTrak-derived)',partial:true,total:j.totalItems,data}));console.log(data.length+' dated starter satellites');}

 for(const [name,url]of Object.entries(sources)){
  const file=path.join(dest,name);
  if(!fs.existsSync(file)){const r=await fetch(url,{signal:AbortSignal.timeout(90000)});if(!r.ok)throw Error(url+' HTTP '+r.status);fs.writeFileSync(file,Buffer.from(await r.arrayBuffer()));}
  const data=fs.readFileSync(file);manifest[name]={url,sha256:crypto.createHash('sha256').update(data).digest('hex'),bytes:data.length};
  if(name.endsWith('.csv')){const rows=csv(data.toString()),headers=rows.shift(),index=Object.fromEntries(headers.map((k,i)=>[k,i]));const airports=rows.filter(r=>r[index.type]!=='closed'&&r[index.ident]&&Number.isFinite(Number(r[index.latitude_deg]))).map(r=>({id:r[index.ident],icao:r[index.gps_code]||r[index.ident],iata:r[index.iata_code],name:r[index.name],city:r[index.municipality],country:r[index.iso_country],type:r[index.type],lat:Number(r[index.latitude_deg]),lon:Number(r[index.longitude_deg]),elevation:Number(r[index.elevation_ft])||0,scheduled:r[index.scheduled_service]==='yes'}));fs.writeFileSync(path.join(dest,'airports.json'),JSON.stringify(airports));fs.unlinkSync(file);console.log(airports.length+' airports');}
 }
 fs.writeFileSync(path.join(dest,'sources.json'),JSON.stringify(manifest,null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
