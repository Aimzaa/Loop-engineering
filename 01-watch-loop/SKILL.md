---
name: iss-watch
description: Har run par ISS (International Space Station) ki current position fetch karke spine file mein log karo aur mausam-jaisa short update do.
---

# ISS Watch — Skill

## Maqsad
International Space Station har ~90 minute mein zameen ka ek chakkar lagata hai.
Is loop ka kaam: har heartbeat par ISS ki live latitude/longitude nikaalo,
`spine.json` mein append karo, aur ek chhota sa human-readable update likho.

## Data source (koi API key nahi chahiye)
- Primary: `https://api.wheretheiss.at/v1/satellites/25544`
  - Response fields: `latitude`, `longitude`, `altitude` (km), `velocity` (km/h), `timestamp`
- Backup: `http://api.open-notify.org/iss-now.json`
  - Response: `iss_position.latitude`, `iss_position.longitude`

## Har run par steps
1. `node fetch-iss.js` chalao (ya khud fetch karo agar script fail ho).
2. Nateeja `spine.json` ke `readings` array mein append karo:
   `{ ts, lat, lon, altitude_km, velocity_kmh, over }`
   - `over` = motay taur par konsa ocean/region (lat/lon se andaaza; agar pata na ho to "open ocean / unknown").
3. Pichhli reading se compare karo aur 1-2 line update likho:
   - direction (north/south, east/west) kis taraf badha
   - approx kitne km move hua (great-circle distance)
4. `spine.json` ka `run_count` +1 karo aur `last_run` update karo.

## Stopping conditions
- **Success / natural end:** `run_count >= 10` (10 readings ke baad summary do aur ruk jao).
- **Retry limit:** dono API 3 dafa lagatar fail -> loop rok do, error log karo.
- **Stuck detection:** agar lagatar 3 readings mein lat/lon bilkul same aayein (ISS to hamesha move karta hai) -> data stale hai, ruk jao.

## Maker–Checker
- Maker: reading fetch + append + update likhna.
- Checker: har append ke baad verify karo ke `spine.json` valid JSON hai, `readings.length == run_count`,
  aur nayi reading ka `ts` pichhli se bada hai. Fail ho to us run ko rollback karo.

## Final output (loop khatam hone par)
`SUMMARY.md` likho: total readings, kitna ground distance cover hua, ISS ne konse regions cross kiye,
sabse tez velocity record.
