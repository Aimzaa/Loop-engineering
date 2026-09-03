# Project 8 - Local Rehearsal (daily triage loop)

Project 3 se farq: **triage rules (P0/P1/P2)** + action-oriented summary + **5-din ka unattended arc**.
Live Routine + real repo + Slack = `NOTES.md` PENDING (end mein, sab projects ke baad).

## Files
| File | Loop part |
|------|-----------|
| `fetch-signals.js` | Connector - GitHub public API (no token) |
| `rules.json` | **YOUR project ki triage rules** - ignore + P0/P1/P2 match rules |
| `triage.js` | Maker - rules + spine parho -> classify -> brief + spine block + outbox |
| `check-triage.js` | Checker - alag process |
| `spine.md` | Spine - "OPEN P0/P1 carried" line = memory |
| `briefs/<date>.md`, `outbox/<date>.txt` | Output |
| `fixtures/day1..5.json` | 5-business-day arc (`make-fixtures.js` se) |
| `reset.js` | rehearsal dubara |

## 5-day arc (fixtures mein built-in)
| Day | Kya | Loop ko dikhна chahiye |
|-----|-----|------------------------|
| 1 | baseline | P0=1 (trunk CI red), P1/P2 populate |
| 2 | naya crash report `#90001` | P0=2, `@here`, #90001 = NEW |
| 3 | `#90001` fix, naya bug `#90002` | `FIXED since last run: #90001`, P0 back to 1 |
| 4 | quiet din, bahut kuch fix | `FIXED` list lambi, P1 girke 3 |
| 5 | security report `#90003` | P0=2 phir, naya P0 |

## Running commands (one-by-one - README order)
```
cd "E:\loop engineering project\08-your-own-daily-loop\rehearsal"
node reset.js
node triage.js --date 2026-09-01 --fixture fixtures/day1.json ; node check-triage.js --date 2026-09-01
node triage.js --date 2026-09-02 --fixture fixtures/day2.json ; node check-triage.js --date 2026-09-02
node triage.js --date 2026-09-03 --fixture fixtures/day3.json ; node check-triage.js --date 2026-09-03
node triage.js --date 2026-09-04 --fixture fixtures/day4.json ; node check-triage.js --date 2026-09-04
node triage.js --date 2026-09-05 --fixture fixtures/day5.json ; node check-triage.js --date 2026-09-05
Get-Content spine.md
Get-Content briefs\2026-09-03.md
```

## Kya seekhna hai
- **Unattended:** 5 din, koi manual mudakhalat nahi - har din brief + spine update.
- **Memory:** din N, din N-1 ka `OPEN P0/P1 carried` parh kar `NEW` vs `CARRIED` aur `FIXED` nikalta hai.
- **Rules = intent:** `rules.json` edit karo -> classification badal jati hai (spec-driven).
- **Weekly improvement:** din 5 ke baad `run-log.md` dekho - jo "missed" tha use nayi `rules.json` entry banao.
- **Maker != Checker:** `triage.js` khud pass nahi karta; `check-triage.js` (alag) karta hai.

## Real Routine version (PENDING)
`/schedule every weekday at 9am, run the daily-triage skill` + sirf 1 repo access + 1 Slack channel.
Live steps `NOTES.md` PENDING section mein.
