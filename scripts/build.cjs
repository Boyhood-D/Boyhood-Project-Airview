const fs=require('node:fs');
const path=require('node:path');
const esbuild=require('esbuild');
const root=path.resolve(__dirname,'..');
Promise.all([
  esbuild.build({entryPoints:[path.join(root,'src/features2d.js')],bundle:true,minify:true,format:'iife',outfile:path.join(root,'src/features2d.bundle.js'),target:'chrome144',legalComments:'eof'}),
  esbuild.build({entryPoints:[path.join(root,'src/orbits-worker.js')],bundle:true,minify:true,format:'iife',outfile:path.join(root,'src/orbits-worker.bundle.js'),target:'chrome144',legalComments:'eof'})
]).catch(e=>{console.error(e);process.exitCode=1;});
