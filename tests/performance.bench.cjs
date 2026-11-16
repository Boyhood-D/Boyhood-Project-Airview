'use strict';
const {performance}=require('node:perf_hooks');const C=require('../src/core.cjs');const E=require('../src/render-engine.cjs');
let seed=42;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
const list=Array.from({length:10000},(_,i)=>({id:String(i),lat:-60+random()*135,lon:-180+random()*360,speed:450,heading:90,observedAt:Date.now()}));
function median(run){const times=[];for(let i=0;i<9;i++){const start=performance.now();run();times.push(performance.now()-start);}return times.sort((a,b)=>a-b)[4];}
let oldCalls=0,newCalls=0;
const baseline=()=>list.slice().sort((a,b)=>{oldCalls+=2;return C.distance([46.8,8.2],[a.lat,a.lon])-C.distance([46.8,8.2],[b.lat,b.lon]);});
const optimized=()=>E.rank(list,'distance',[46.8,8.2],(a,b)=>{newCalls++;return C.distance(a,b);});
baseline();optimized();oldCalls=0;newCalls=0;const before=median(baseline),after=median(optimized);
console.log(JSON.stringify({aircraft:10000,iterations:9,statistic:'median',distanceSort:{beforeMs:+before.toFixed(3),afterMs:+after.toFixed(3),speedup:+(before/after).toFixed(2),beforeDistanceCalls:oldCalls/9,afterDistanceCalls:newCalls/9},scope:'CPU distance-sort microbenchmark, not whole-application FPS or network latency'},null,2));
