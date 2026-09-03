# Project 3 - The Morning Brief with a Memory (Scheduled Heartbeat)

**Course goal:** Har weekday 9am par overnight CI failures + issues review karo, phir summary post karo.
**Heartbeat:** Scheduled (Routine)
**"Done" ka matlab:** Summary post ho jaye; loop saaf exit kare. **Part 4 (spine/state) par depend karta hai** -
yeh dikhata hai ke saved state runs ke beech memory kaise carry karti hai.

Yeh folder ek **is machine pe chalne wala** version hai: asli GitHub public data (koi token nahi),
`spine.md` = memory, `build-brief.js` = maker, `check-brief.js` = alag checker, `outbox/` = Slack ki jagah.

---

## Files
| File | Loop part |
|------|-----------|
| `fetch-signals.js` | Connector - GitHub public REST API |
| `build-brief.js` | Maker - spine parho → NEW/FIXED/STILL OPEN diff → brief + spine block + outbox |
| `check-brief.js` | Checker - alag process, brief + spine verify |
| `spine.md` | Spine (memory between runs) |
| `briefs/<date>.md`, `outbox/<date>.txt` | Output |
| `fixtures/day1.json`, `fixtures/day2.json` | Rehearsal ke liye saved/edited signal sets |
| `reset.js` | Rehearsal dubara shuru karne ke liye |

---

## Running command (is machine pe - rehearsal)

Ek beat = fetch → build → check. Aik hi line:
```
cd "E:\loop engineering project\03-morning-brief-memory"
node fetch-signals.js --repo cli/cli --hours 24 | node build-brief.js && node check-brief.js
```

**Memory dekhne ke liye 2 "din" chalao** (dusra din simulate - signals thode alag):
```
node reset.js
node build-brief.js --date 2026-09-01 --fixture fixtures/day1.json && node check-brief.js --date 2026-09-01
node build-brief.js --date 2026-09-02 --fixture fixtures/day2.json && node check-brief.js --date 2026-09-02
```
Day 2 ka `briefs/2026-09-02.md` khol kar dekho - `NEW` aur `FIXED` sections day 1 ke `spine.md` block
se diff karke bhare gaye hain. **Yehi memory hai.**

### Claude Code ke andar (skill-driven)
```
claude
> Read SKILL.md. Do exactly one morning-brief beat for today. Obey the stopping conditions.
```

### Idempotency test
Same din dobara chalao → `build-brief.js` khud `SKIP: spine.md already has a block` deta hai (duplicate guard).

---

## Real Routine version (Claude Max + Slack chahiye)
```
/schedule every weekday at 9am, run the morning-brief skill
```
Farq: `fetch-signals.js` → tumhara private repo + real CI - `outbox/` → Slack `#eng-morning-brief`
(`${SLACK_TOKEN}` secret, Project 10) - local run → cloud Routine - access = sirf 1 repo + 1 channel.

---

## Kya sikhaya
- **Spine = memory.** Beat 2 ne beat 1 ka `STILL OPEN` parh kar `NEW`/`FIXED` compute kiya - bina uske
  har din sab kuch "NEW" hota.
- **Maker != Checker.** `build-brief.js` ne khud ko pass nahi kaha; `check-brief.js` (alag process) ne kiya.
- **3 stops:** success (post + spine), retry limit (3 fetch fails), duplicate guard (aaj ka block already hai).
- **Connector seam:** yahan filesystem (`outbox/`), production mein Slack - loop ka baaki hissa same rehta hai.
