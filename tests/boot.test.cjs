const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function launch(reduced=false){
 let now=0,removed=false,nextId=0;const timers=new Map(),events=new Map(),classes=new Set(),screen={classList:{add(){}},remove(){removed=true;}},skip={};
 const context={performance:{now:()=>now},matchMedia:()=>({matches:reduced}),window:{addEventListener:(name,fn)=>events.set(name,fn)},document:{body:{classList:{add:name=>classes.add(name),remove:name=>classes.delete(name),toggle:(name,value)=>value?classes.add(name):classes.delete(name)}},getElementById:id=>id==='boot-screen'?screen:id==='boot-skip'?skip:{}},setTimeout:(fn,ms)=>{timers.set(++nextId,{fn,at:now+ms});return nextId;},clearTimeout:id=>timers.delete(id),requestAnimationFrame:fn=>context.setTimeout(fn,16)};
 vm.runInNewContext(fs.readFileSync(require.resolve('../src/boot.js'),'utf8'),context);
 function advance(end){for(;;){const pending=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!pending)break;now=pending[1].at;timers.delete(pending[0]);pending[1].fn();}now=end;}
 return {advance,ready:()=>events.get('airview:ready')(),skip:()=>skip.onclick(),get removed(){return removed;},classes};
}
test('startup cannot trap the app when initialization never signals ready',()=>{const app=launch();app.advance(3500);assert.equal(app.removed,true);assert.ok(app.classes.has('app-ready'));});
test('skip dismisses startup without waiting for a network or ready event',()=>{const app=launch();app.skip();app.advance(300);assert.equal(app.removed,true);});
test('reduced motion exits promptly after the first prepared frame',()=>{const app=launch(true);app.ready();app.advance(40);assert.equal(app.removed,true);assert.ok(app.classes.has('app-ready'));});
