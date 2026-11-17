/* Local development preview. Bind only to loopback; no remote server. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { traffic } = require('../src/network.cjs');
const space=require('../src/space-network.cjs');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.cjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.geojson':'application/json','.json':'application/json','.jpg':'image/jpeg'};
http.createServer(async (req,res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if(['/api/satellites','/api/metadata','/api/airportBoard'].includes(url.pathname)){ const q=Object.fromEntries(url.searchParams); const result=await (url.pathname.endsWith('satellites')?space.satellites(path.join(root,'Airview-data')):url.pathname.endsWith('metadata')?space.metadata(q):space.airportBoard(q));res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(result));return;}
  if(url.pathname === '/api/traffic') {
    const result = await traffic(Object.fromEntries(url.searchParams));
    res.writeHead(200, {'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(result));return;
  }
  const relative = url.pathname === '/' ? 'src/index.html' : decodeURIComponent(url.pathname).replace(/^\//,'');
  const file = path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try{let data=fs.readFileSync(file);if(path.extname(file)==='.html'&&url.searchParams.has('benchmark'))data=Buffer.from(data.toString().replace('<script src="renderer.js"></script>','<script src="../tests/browser-fixture.js"></script><script src="renderer.js"></script>')); res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Airview preview: http://127.0.0.1:4173/src/index.html'));

