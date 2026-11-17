// HTTPS response dates compensate for an inaccurate PC clock without changing it.
let offset=0,synced=false;
function observe(headers,receivedAt=Date.now()){
 const date=Date.parse(headers.get('date')||''),age=Number(headers.get('age')||0);
 if(Number.isFinite(date)&&Number.isFinite(age)&&age>=0&&age<86400){offset=date+age*1000-receivedAt;synced=true;}
 return {utcOffset:offset,clockSynced:synced};
}
function state(){return {utcOffset:offset,clockSynced:synced};}
module.exports={observe,state};
