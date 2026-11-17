const {test}=require('node:test'),assert=require('node:assert/strict');
const {flightPhase}=require('../src/flight-phase.cjs');
const now=1000000,base={observedAt:now,ground:false,altitude:32000,speed:430,verticalRate:0};
test('reported ground state takes precedence over unreliable vertical rate',()=>{
 assert.equal(flightPhase({...base,ground:true,speed:0,verticalRate:500},{now}).label,'Au sol · immobile');
 assert.equal(flightPhase({...base,ground:true,speed:15},{now}).label,'Roulage probable');
 assert.equal(flightPhase({...base,ground:true,speed:null},{now}).label,'Au sol');
});
test('missing values and stale reports do not fabricate a cruise phase',()=>{
 assert.equal(flightPhase({...base,verticalRate:null},{now}).code,'unknown');
 assert.equal(flightPhase({...base,observedAt:now-91000},{now}).code,'unknown');
 assert.equal(flightPhase({...base,altitude:null,speed:null,verticalRate:500},{now}).label,'Montée');
});
test('proximity distinguishes a probable approach without treating barometric altitude as AGL',()=>{
 const a={...base,altitude:8500,verticalRate:-900};
 assert.equal(flightPhase(a,{now}).label,'Descente');
 assert.equal(flightPhase(a,{now,airport:{distance:5,elevation:7000}}).label,'Approche probable');
 assert.equal(flightPhase(a,{now,airport:{distance:5,elevation:0}}).label,'Descente');
});
test('takeoff requires a recent reported ground transition and a nearby airport',()=>{
 const a={...base,altitude:2000,verticalRate:1000};
 const context={now,previous:{...a,ground:true,observedAt:now-30000},airport:{distance:1,elevation:1000}};
 assert.equal(flightPhase(a,context).label,'Décollage probable');
 assert.equal(flightPhase(a,{...context,previous:null}).label,'Montée');
});
test('landing remains probable and requires a recent air to ground transition',()=>{
 const a={...base,ground:true,speed:80};
 assert.equal(flightPhase(a,{now,previous:{...base,observedAt:now-30000},airport:{distance:1,elevation:0}}).label,'Atterrissage probable');
 assert.equal(flightPhase(a,{now,previous:{...base,observedAt:now-400000},airport:{distance:1,elevation:0}}).label,'Déplacement rapide au sol');
});
test('vertical rate can be derived from two observations but not a long data gap',()=>{
 const a={...base,altitude:33000,verticalRate:null};
 assert.equal(flightPhase(a,{now,previous:{...base,observedAt:now-60000}}).code,'climb');
 assert.equal(flightPhase(a,{now,previous:{...base,observedAt:now-400000}}).code,'unknown');
 assert.equal(flightPhase(base,{now}).label,'Croisière probable');
});
