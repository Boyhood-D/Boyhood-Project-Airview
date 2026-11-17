/* Short local launch transition. Never wait for a network provider to continue. */
(()=>{
 const screen=document.getElementById('boot-screen'),label=document.getElementById('boot-label'),start=performance.now();
 let done=false,ready=false,timer;
 function finish(){if(done)return;done=true;clearTimeout(timer);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||window.AirviewMap?.getState().settings.animations===false;document.body.classList.toggle('motion-disabled',reduced);screen.classList.add('boot-out');document.body.classList.add('app-ready');setTimeout(()=>{screen.remove();document.body.classList.remove('motion-disabled');},reduced?0:260);}
 function prepared(){if(ready||done)return;ready=true;label.textContent='Prêt à explorer.';const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||window.AirviewMap?.getState().settings.animations===false;setTimeout(finish,reduced?0:Math.max(0,600-(performance.now()-start)));}
 document.getElementById('boot-skip').onclick=finish;
 window.addEventListener('airview:ready',()=>requestAnimationFrame(()=>requestAnimationFrame(prepared)),{once:true});
 timer=setTimeout(finish,3000);
})();
