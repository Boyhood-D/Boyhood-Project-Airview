/* Measure the introduction from the native window display, not page parsing. */
(()=>{
 const screen=document.getElementById('boot-screen'),label=document.getElementById('boot-label');
 let done=false,ready=false,shownAt=null,timer;
 function finish(){if(done)return;done=true;clearTimeout(timer);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||window.AirviewMap?.getState().settings.animations===false;document.body.classList.toggle('motion-disabled',reduced);screen.classList.add('boot-out');document.body.classList.add('app-ready');setTimeout(()=>{screen.remove();document.body.classList.remove('motion-disabled');},reduced?0:260);}
 function prepared(){ready=true;label.textContent='Prêt à explorer.';schedule();}
 function schedule(){if(done||!ready||shownAt===null)return;clearTimeout(timer);timer=setTimeout(finish,Math.max(0,1800-(performance.now()-shownAt)));}
 function shown(){if(done||shownAt!==null)return;shownAt=performance.now();screen.classList.add('boot-visible');timer=setTimeout(finish,3500);schedule();}
 document.getElementById('boot-skip').onclick=finish;
 window.addEventListener('airview:ready',()=>requestAnimationFrame(()=>requestAnimationFrame(prepared)),{once:true});
 if(window.radar?.showWindow)window.radar.showWindow().then(shown,shown);else requestAnimationFrame(shown);
 // Never run the normal minimum-duration clock before the native first frame.
 setTimeout(()=>{if(shownAt===null)finish();},8000);
})();
