// ISS position fetcher — no API key needed.
// Usage: node fetch-iss.js
// Prints one JSON line: { ts, lat, lon, altitude_km, velocity_kmh, source }

const PRIMARY = "https://api.wheretheiss.at/v1/satellites/25544";
const BACKUP = "http://api.open-notify.org/iss-now.json";

async function tryPrimary() {
  const r = await fetch(PRIMARY, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`primary HTTP ${r.status}`);
  const d = await r.json();
  return {
    ts: new Date(d.timestamp * 1000).toISOString(),
    lat: Number(d.latitude),
    lon: Number(d.longitude),
    altitude_km: Number(d.altitude),
    velocity_kmh: Number(d.velocity),
    source: "wheretheiss.at",
  };
}

async function tryBackup() {
  const r = await fetch(BACKUP, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`backup HTTP ${r.status}`);
  const d = await r.json();
  return {
    ts: new Date(d.timestamp * 1000).toISOString(),
    lat: Number(d.iss_position.latitude),
    lon: Number(d.iss_position.longitude),
    altitude_km: null,
    velocity_kmh: null,
    source: "open-notify.org",
  };
}

(async () => {
  let lastErr;
  for (const fn of [tryPrimary, tryBackup]) {
    try {
      const out = await fn();
      process.stdout.write(JSON.stringify(out) + "\n");
      return;
    } catch (e) {
      lastErr = e;
    }
  }
  console.error("FETCH_FAILED:", lastErr?.message || lastErr);
  process.exit(1);
})();
