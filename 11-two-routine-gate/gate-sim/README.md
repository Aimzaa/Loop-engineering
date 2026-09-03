# Project 11 - Two-Routine Gate (local simulation)

Do CLOUD Routines (9:00 + 9:30) = NOTES.md PENDING. Yahan ka core: **do alag processes**
(`maker-routine.js`, `checker-routine.js`) jo sirf `progress.md` (spine) ke zariye baat karte hain.
**Jo likhta hai wo grade nahi karta.**

## Files
| File | Kya |
|------|-----|
| `shared-skill.md` | dono routines yehi parhte hain - scope + PASS rubric |
| `main/config.js` (+ `.test.js`) | the "repo" |
| `inbox/day1.json`, `day2.json` | maker ka us din ka task |
| `maker-routine.js` | task lo -> chhota patch -> `prs/pr-<n>/` mein "PR" kholo -> `progress.md` block (verdict pending) |
| `checker-routine.js` | `progress.md` se PR id parho -> rubric grade -> PASS=merge / FAIL=COMMENT.md + PR khula |
| `progress.md` | spine - maker likhta, checker sirf verdict line badalta |
| `reset.js` | prs wipe, main restore, progress trim |

## 2-din ki kahani
| Day | Task | Nateeja |
|-----|------|---------|
| 1 | `#4101` timeout 30s->60s (sirf number) | in-scope -> checker **PASS -> merged** (`main/config.js` TIMEOUT_MS = 60000) |
| 2 | `#4102` `retry()` mein naya param | signature change -> checker **FAIL** -> PR khula, `COMMENT.md`, `main/` unchanged |

## Running (one-by-one, PowerShell)
```
cd "E:\loop engineering project\11-two-routine-gate\gate-sim"
node reset.js
node maker-routine.js --task inbox/day1.json --date 2026-09-01
node checker-routine.js --date 2026-09-01
Get-Content main\config.js | Select-String TIMEOUT_MS         # -> 60000 (merged)
node maker-routine.js --task inbox/day2.json --date 2026-09-02
node checker-routine.js --date 2026-09-02                     # -> FAIL, PR left open
Get-Content main\config.js | Select-String "function retry"   # -> unchanged
Get-Content progress.md
Get-Content prs\pr-2\COMMENT.md
```

## Kya seekhna hai (course)
- **"Jo agent code likhta hai wo wo agent nahi jo use grade karta."** Do alag processes.
- **Spine = wahid raabta:** checker ko PR number sirf `progress.md` se milta hai - maker ke process se nahi.
- **Gate ke do outcomes:** PASS -> auto-merge; FAIL -> PR khula + comment, insaan ke liye.
- **Idempotent:** dobara chalao -> maker `SKIP` (aaj ka block hai), checker `SKIP` (verdict already).
