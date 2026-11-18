const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function launch(reduced=false,showDelay=null){
 let now=0,removed=false,nextId=0;const timers=new Map(),events=new Map(),classes=new Set(),screen={classList:{add(){}},remove(){removed=true;}},skip={};
 const context={performance:{now:()=>now},matchMedia:()=>({matches:reduced}),window:{addEventListener:(name,fn)=>events.set(name,fn)},document:{body:{classList:{add:name=>classes.add(name),remove:name=>classes.delete(name),toggle:(name,value)=>value?classes.add(name):classes.delete(name)}},getElementById:id=>id==='boot-screen'?screen:id==='boot-skip'?skip:{}},setTimeout:(fn,ms)=>{timers.set(++nextId,{fn,at:now+ms});return nextId;},clearTimeout:id=>timers.delete(id),requestAnimationFrame:fn=>context.setTimeout(fn,16)};
 if(showDelay!==null)context.window.radar={showWindow:()=>({then:fn=>context.setTimeout(fn,showDelay)})};
 vm.runInNewContext(fs.readFileSync(require.resolve('../src/boot.js'),'utf8'),context);
 function advance(end){for(;;){const pending=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!pending)break;now=pending[1].at;timers.delete(pending[0]);pending[1].fn();}now=end;}
 return {advance,ready:()=>events.get('airview:ready')(),skip:()=>skip.onclick(),get removed(){return removed;},classes};
}
test('startup cannot trap the app when initialization never signals ready',()=>{const app=launch();app.advance(4000);assert.equal(app.removed,true);assert.ok(app.classes.has('app-ready'));});
test('skip dismisses startup without waiting for a network or ready event',()=>{const app=launch();app.skip();app.advance(300);assert.equal(app.removed,true);});
test('reduced motion preserves a visible static introduction before dismissal',()=>{const app=launch(true);app.ready();app.advance(1000);assert.equal(app.removed,false);app.advance(1200);assert.equal(app.removed,true);assert.ok(app.classes.has('app-ready'));});
test('normal startup stays visible then dismisses without waiting for providers',()=>{const app=launch();app.ready();app.advance(1100);assert.equal(app.removed,false);app.advance(1500);assert.equal(app.removed,true);});

test('intro timing starts after native window acknowledgement, not renderer readiness',()=>{const app=launch(false,700);app.ready();app.advance(1700);assert.equal(app.removed,false);app.advance(2100);assert.equal(app.removed,true);});

test('a missing native reply cannot trap the startup overlay',()=>{const app=launch(false,100000);app.ready();app.advance(8500);assert.equal(app.removed,true);});
