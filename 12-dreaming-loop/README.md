# Project 12 - Build a Dreaming Loop (fully local)

**Course goal:** Ek loop jo waqt ke saath behtar ho - har raat scan, har subah TUM skill mein woh
pattern add karo jo raat ko Missed hua. Hafte baad output day-1 se saaf behtar.
**"Done":** day-7 par caught count day-1 se numaya zyada.

**Key line (course):** _"The loop does not rewrite itself. You do."_ Har subah ka edit tumhara -
loop sirf batata hai kya miss hua.

## Files
| File | Kya |
|------|-----|
| `SKILL.md` | current skill - `## Patterns` block: `- id \| regex \| name`. Day-1 = sirf 3 patterns |
| `scan-target/payments.js` | 9 planted risky patterns |
| `patterns-full.json` | ground truth (9) - `Missed` yahin se compute hota hai |
| `scan.js` | ek nightly beat: skill parho -> scan -> `progress.md` mein Found/Missed |
| `skill-history/day-1..7.md` | 7-din ka skill evolution (har din +1 pattern) |
| `replay.js` | poora 7-din arc chala kar `metrics.md` bhar deta hai |
| `progress.md` | spine - har raat ka Found/Missed + "kal kya add karna" |
| `reset.js` | SKILL.md -> day-1, progress.md -> header |

## Manual flow (one-by-one, PowerShell)
```
cd "E:\loop engineering project\12-dreaming-loop"
node reset.js
node scan.js                                      # day-1 skill: caught 3/9, asks for 'sql-concat'
Copy-Item skill-history\day-2.md SKILL.md         # <- "morning edit": add the missed pattern
node scan.js --date 2026-09-02                    # caught 4/9, asks for 'empty-catch'
node replay.js                                    # runs all 7 days, writes metrics.md
Get-Content progress.md
Get-Content metrics.md
```

## Result (verified)
| Day | Caught | Next asked |
|-----|--------|-----------|
| 1 | 3/9 | sql-concat |
| 4 | 6/9 | no-timeout |
| 7 | **9/9** | - |

Day-1 skill: `secret, eval, weak-random`. Day-7: all 9. Loop ne khud kuch nahi badla - har subah
insaan ne pichli raat ka Missed pattern add kiya.

## Real Routine version
`/schedule nightly, run the risk-scan skill` -> subah `progress.md` dekho -> `SKILL.md` edit karo ->
agli raat updated skill chalti hai. Loop is machine par bhi chal jata hai (upar wala manual flow).
