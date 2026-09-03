# ISS Watch — Run Summary

**Loop:** in-session (`/loop`, 1-minute heartbeat via cron `*/1 * * * *`)
**Window:** 2026-08-31 21:12:05 UTC → 21:28:22 UTC (~16 min)
**Beats recorded:** 10 / 10
**Stopped by:** success condition — `run_count` reached `max_runs` (10)
**Failures:** 0 · **Checker:** PASS on every beat

## What the ISS did

| Metric | Value |
|--------|-------|
| Start position | lat +9.46, lon +159.82 — Pacific, near the Solomon Islands (northern hemisphere) |
| End position | lat -37.72, lon -159.27 — South Pacific, open ocean NE of New Zealand |
| Total ground track (sum of 10 hops) | **~6,752 km** |
| Net heading | consistently SOUTH-EAST every single beat |
| Notable crossings | crossed the **equator** (beat 2→3) and the **180° antimeridian** (beat 3→4, longitude flipped +178 → -178) |
| Altitude | rose steadily 418.8 km → 434.3 km over the pass |
| Velocity | eased 27,585 km/h → 27,539 km/h (**fastest: 27,585 km/h at beat 1**) |
| Regions | Solomon Is. → Fiji → past Tonga → open South Pacific toward the NZ / South America gap |

## Reading log

| # | Time (UTC) | Lat | Lon | Alt km | km since prev |
|---|-----------|-----|-----|--------|---------------|
| 1 | 21:12:05 | 9.46 | 159.82 | 418.8 | — |
| 2 | 21:12:42 | 7.58 | 161.18 | 419.0 | 256 |
| 3 | 21:20:33 | -16.24 | 178.47 | 424.9 | 3,262 |
| 4 | 21:21:54 | -20.22 | -178.28 | 426.5 | 560 |
| 5 | 21:22:43 | -22.59 | -176.23 | 427.4 | 338 |
| 6 | 21:23:22 | -24.45 | -174.54 | 428.2 | 269 |
| 7 | 21:24:19 | -27.12 | -171.97 | 429.4 | 393 |
| 8 | 21:25:21 | -29.96 | -169.02 | 430.7 | 427 |
| 9 | 21:27:13 | -34.87 | -163.21 | 432.9 | 771 |
| 10 | 21:28:22 | -37.72 | -159.27 | 434.3 | 474 |

_(Bigger gaps at beats 3 and 9: cron only fires while the REPL is idle, so ticks during a busy turn are skipped — a real property of in-session loops.)_

## Loop-engineering takeaways demonstrated

1. **Heartbeat** = the 1-minute cron; it lives in this session — close the terminal and it dies.
2. **Spine** (`spine.json`) carried state between beats — each beat compared against the previous reading.
3. **Maker / checker split** — the fetch+append step never declared itself done; `check.js` (separate process) graded every beat and PASSED all 10.
4. **Stopping condition** — the loop ended itself on a *success* condition (10 beats), not by running forever. Retry-limit (3 API fails) and stuck-detection (3× identical position) were armed but never triggered.
