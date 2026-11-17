'use strict';
const { normalizeAdsb, normalizeOpenSky } = require('./core.cjs');
const clock=require('./clock.cjs');
const nextAllowed = new Map();
const latest = new Map();
async function traffic(query) {
  const provider = query && query.provider === 'opensky' ? 'opensky' : 'adsb';
  const lat = Number(query.lat), lon = Number(query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 85 || Math.abs(lon) > 180) throw new Error('Centre radar invalide.');
  const now = Date.now(), next = nextAllowed.get(provider) || 0;
  const key=provider==='opensky'?provider:`${provider}:${lat.toFixed(4)}:${lon.toFixed(4)}`;
  if (now < next) {
    const cached=latest.get(key);
    return cached?{...cached,cached:true,retryAfter:Math.ceil((next-now)/1000)}:{ok:false,pending:true,message:'Temporisation du fournisseur.',retryAfter:Math.ceil((next-now)/1000)};
  }
  const interval = provider === 'opensky' ? 60000 : 15000;
  nextAllowed.set(provider, now + interval);
  const url = provider === 'opensky' ? 'https://opensky-network.org/api/states/all?extended=1' : `https://api.adsb.lol/v2/point/${lat.toFixed(4)}/${lon.toFixed(4)}/250`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'Airview/1.0 (personal aviation enthusiast)' } });
    if (!res.ok) {
      const rawRetry = res.headers.get('retry-after') || res.headers.get('x-rate-limit-retry-after-seconds');
      const parsed = Number(rawRetry), delay = Number.isFinite(parsed) && parsed > 0 ? Math.min(86400, Math.max(interval / 1000, parsed)) : res.status === 429 ? 900 : 60;
      nextAllowed.set(provider, Date.now() + delay * 1000);
      return { ok: false, message: res.status === 429 ? 'Quota public atteint. Reprise automatique après le délai du fournisseur.' : `Fournisseur indisponible (HTTP ${res.status}).`, retryAfter: delay };
    }
    const data = await res.json(), receivedAt = Date.now();
    const result={ ok: true, provider, receivedAt, ...clock.observe(res.headers,receivedAt), aircraft: provider === 'adsb' ? normalizeAdsb(data, receivedAt) : normalizeOpenSky(data, receivedAt), quota: res.headers.get('x-rate-limit-remaining'), retryAfter: interval / 1000 };
    // Keep only the last scope for each source. Switching 2D/3D does not refetch.
    for(const k of latest.keys())if(k.startsWith(provider))latest.delete(k);
    latest.set(key,result);return result;
  } catch (e) {
    console.warn('[Airview] Provider request failed:', e.name, e.cause?.code || e.message);
    return { ok: false, message: e.name === 'TimeoutError' ? 'Le fournisseur ne répond pas. Nouvelle tentative dans une minute.' : 'Connexion indisponible. Vérifie Internet ou réessaie plus tard.', retryAfter: 60 };
  }
}
module.exports = { traffic };

