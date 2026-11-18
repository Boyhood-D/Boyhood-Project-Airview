/* Shared, dependency-free geometry and provider normalization. */
(function (root) {
  'use strict';
  const number = v => typeof v === 'number' && Number.isFinite(v) ? v : null;
  const wrap = lon => ((lon + 180) % 360 + 360) % 360 - 180;
  function validPosition(lat, lon) { return number(lat) !== null && number(lon) !== null && Math.abs(lat) <= 90 && Math.abs(lon) <= 180; }
  function distance(a, b) {
    const r = Math.PI / 180, dlat = (b[0] - a[0]) * r, dlon = (b[1] - a[1]) * r;
    const h = Math.sin(dlat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dlon / 2) ** 2;
    return 3440.065 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
  }
  function destination(lat, lon, heading, nm) {
    const r = Math.PI / 180, d = nm / 3440.065, a = lat * r, b = heading * r;
    const next = Math.asin(Math.sin(a) * Math.cos(d) + Math.cos(a) * Math.sin(d) * Math.cos(b));
    return [next / r, wrap(lon + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(a), Math.cos(d) - Math.sin(a) * Math.sin(next)) / r)];
  }
  function normalizeAdsb(data, receivedAt = Date.now()) {
    if (!data || !Array.isArray(data.ac)) throw new Error('Invalid ADS-B response.');
    return data.ac.filter(a => validPosition(a.lat, a.lon) && typeof a.hex === 'string' && number(a.seen_pos) !== null && a.seen_pos <= 90).map(a => ({
      id: a.hex.toLowerCase(), callsign: String(a.flight || '').trim(), registration: a.r || '', model: a.t || '', country: '',
      lat: a.lat, lon: a.lon, altitude: a.alt_baro === 'ground' ? 0 : number(a.alt_baro), ground: a.alt_baro === 'ground',
      speed: number(a.gs), heading: number(a.track), verticalRate: number(a.baro_rate), squawk: a.squawk || '', category: a.category || '',
      source: a.type || 'ADS-B', observedAt: receivedAt - a.seen_pos * 1000,
      windDirection: number(a.wd), windSpeed: number(a.ws), temperature: number(a.oat), mach: number(a.mach),
      indicatedSpeed: number(a.ias), selectedAltitude: number(a.nav_altitude_mcp), rssi: number(a.rssi)
    }));
  }
  function normalizeOpenSky(data, receivedAt = Date.now()) {
    if (!data || (!Array.isArray(data.states) && data.states !== null) || number(data.time) === null) throw new Error('Invalid OpenSky response.');
    return (data.states || []).filter(a => Array.isArray(a) && validPosition(a[6], a[5]) && typeof a[0] === 'string' && number(a[3]) !== null && data.time - a[3] <= 90 && data.time-a[3]>=-30).map(a => ({
      id: a[0].toLowerCase(), callsign: String(a[1] || '').trim(), registration: '', model: '', country: String(a[2] || ''),
      lat: a[6], lon: a[5], altitude: number(a[7]) === null ? null : a[7] * 3.28084, ground: !!a[8],
      speed: number(a[9]) === null ? null : a[9] * 1.943844, heading: number(a[10]), verticalRate: number(a[11]) === null ? null : a[11] * 196.8504,
      squawk: a[14] || '', category: String(a[17] || ''), source: ['ADS-B', 'ASTERIX', 'MLAT', 'FLARM'][a[16]] || 'OpenSky', observedAt: receivedAt - Math.max(0,data.time-a[3])*1000, sourceObservedAt:a[3]*1000
    }));
  }
  function filterAircraft(list, f, favorites = []) {
    const q = String(f.search || '').toLowerCase().trim();
    return list.filter(a => (!q || [a.callsign, a.id, a.registration, a.model, a.country, a.squawk].some(v => String(v || '').toLowerCase().includes(q))) &&
      (!f.airborne || !a.ground) && (!f.favorites || favorites.includes(a.id)) &&
      (!(f.minAltitude > 0) || a.altitude !== null && a.altitude >= f.minAltitude) &&
      (!(f.maxAltitude < 60000) || a.altitude !== null && a.altitude <= f.maxAltitude) &&
      (!(f.minSpeed > 0) || a.speed !== null && a.speed >= f.minSpeed) &&
      (!f.emergency || ['7500', '7600', '7700'].includes(a.squawk)));
  }
  function mergeTracks(tracks, list, now) {
    for (const a of list) {
      let track = tracks.get(a.id) || [];
      const last = track[track.length - 1];
      if (!last || a.observedAt > last.time && (a.lat !== last.lat || a.lon !== last.lon)) track.push({ lat: a.lat, lon: a.lon, time: a.observedAt, altitude: a.altitude });
      track = track.filter(p => now - p.time < 20 * 60 * 1000).slice(-120);
      tracks.set(a.id, track);
    }
    for (const [id, track] of tracks) if (!track.length || now - track[track.length - 1].time > 20 * 60 * 1000) tracks.delete(id);
  }
  function csv(list) {
    const escape = v => { let s = String(v == null ? '' : v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
    const keys = ['id', 'callsign', 'registration', 'model', 'country', 'lat', 'lon', 'altitude', 'speed', 'heading', 'verticalRate', 'squawk', 'source', 'observedAt'];
    return '\ufeff' + keys.map(escape).join(',') + '\r\n' + list.map(a => keys.map(k => escape(a[k])).join(',')).join('\r\n');
  }
  const api = { number, wrap, validPosition, distance, destination, normalizeAdsb, normalizeOpenSky, filterAircraft, mergeTracks, csv };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RadarCore = api;
})(typeof window !== 'undefined' ? window : globalThis);

