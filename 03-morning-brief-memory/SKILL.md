---
name: morning-brief
description: Har weekday subah ek public repo ke overnight signals (naye/updated open issues + fail hui CI runs) jama karo, spine.md se pichle run ka context uthao, NEW/FIXED/STILL OPEN brief banao, "post" karo, aur spine mein aaj ka block append karo.
---

# Morning Brief - Skill

## Is folder ke parts
| Loop part | File |
|-----------|------|
| Connector | `fetch-signals.js` - GitHub public REST API (no token, ~60 req/hr) |
| Maker | `build-brief.js` - spine parho -> diff -> brief + spine block + outbox likho |
| Checker | `check-brief.js` - ALAG process, brief + spine verify karta hai |
| Spine (memory) | `spine.md` - har run ka `NEW / FIXED / STILL OPEN` block |
| Output ("Slack") | `outbox/<date>.txt` - yahan asli Slack POST lagti (README dekho) |
| Brief | `briefs/<date>.md` |

## Har run (ek beat) par steps
1. `node fetch-signals.js --repo <owner/name> --hours 24` - signals lo.
2. Us JSON ko `node build-brief.js` mein pipe karo (ya `--fixture` do).
   - `build-brief.js` khud `spine.md` ka **aakhri block** parh kar uski `STILL OPEN` list ko "memory" banata hai.
   - Aaj ke items us memory se diff hote hain:
     - **NEW** = aaj hai, pichli baar STILL OPEN mein nahi tha
     - **FIXED** = pichli baar STILL OPEN tha, aaj nahi hai
     - **STILL OPEN** = dono mein hai (+ aaj ke NEW bhi agle run ke liye open count hote hain)
3. `node check-brief.js --date <date>` - checker. Exit 0 = post karo, exit 1 = roll back.
4. Checker PASS -> `outbox/<date>.txt` "post" ho gaya samjho; spine.md mein aaj ka block already append ho chuka.

## Stopping conditions
- **Success:** brief bana + checker PASS + spine block append -> is run ka kaam khatam, exit clean.
- **Retry limit:** `fetch-signals.js` 3 dafa fail (network / rate limit) -> spine mein `error` note, exit non-zero, koi post nahi.
- **Duplicate guard (idempotent):** `spine.md` mein aaj ki date ka block pehle se ho -> `build-brief.js` khud SKIP karta hai.
- **Quiet day:** kuch NEW/FIXED nahi -> brief phir bhi banta hai ("Quiet overnight"), spine phir bhi update.

## Maker-Checker
- Maker (`build-brief.js`) khud ko "done" nahi kehta.
- Checker (`check-brief.js`, alag process) verify karta hai: teenon sections maujood, koi `<PLACEHOLDER>` nahi,
  spine ka aakhri block aaj ka hai, us date ka sirf ek block (no dup), outbox likha gaya.

## Asli (production) version - kya badalta hai
- **Connector:** `fetch-signals.js` ki jagah tumhare private repo + real CI (auth token secret se - Project 10).
- **Output:** `outbox/<date>.txt` likhne ki jagah Slack connector se `#eng-morning-brief` par POST
  (`${SLACK_TOKEN}` secret).
- **Heartbeat:** local run ki jagah cloud **Routine**: `every weekday at 9am`.
- **Access:** sirf ek repo, sirf ek Slack channel.
