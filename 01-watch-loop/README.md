# Project 1 — Watch Loop (In-Session Heartbeat)

**Course goal:** ISS ki asli position har minute update hote dekho jab tum saath saath koi aur kaam kar rahe ho.
**Heartbeat:** In-session (`/loop`)
**"Done" ka matlab:** ISS location musalsal refresh hoti rahe; terminal band karo to watching band. Bas.

---

## Level 1 — Course wala exact tareeqa (5 minute)

Course ke labs repo mein starter hai:
```
git clone https://github.com/panaversity/agentfactory-labs.git
cd agentfactory-labs/crash-course/loop-eng/iss-loop
claude
```
Folder trust karo (yes), phir session ke andar sirf ye ek line:
```
/loop show me the location of the ISS every minute
```
Har 60 second baad nayi position aati rahegi. **Rokne ke liye:** terminal band karo ya likho `cancel the ISS loop`.

**Key insight:** heartbeat tumhari khuli session ke andar zinda hai. Session band = loop khatam. Yehi
in-session loop ki tareef hai.

---

## Level 2 — Isi folder mein, spine + stopping conditions ke saath (course ke Part 3-4 ka amal)

Yahan maine woh sab add kiya hai jo Level 1 mein chhupa hua hai: state file, checker, aur 3 stops.

1. Is folder ko Claude Code mein kholo:
   ```
   cd "E:\loop engineering project\01-watch-loop"
   claude
   ```
2. Session ke andar:
   ```
   /loop 1m Read SKILL.md and do exactly one run each time it fires. Stop when the stopping conditions in SKILL.md are met, then write SUMMARY.md.
   ```
3. Loop khud 10 readings ke baad rukega aur `SUMMARY.md` bana dega. Manual stop: `/loop stop`.

### Manual test (loop ke baghair)
```
node fetch-iss.js
```
Ek JSON line deta hai — yehi agent har run par karta hai.

### Kya dekhna hai (learning check)
- `spine.json` har run ke baad badhta hai (`run_count`, `readings[]`).
- 3 stops kaam karte hain: success (10 runs), retry limit (3 fails), stuck (same lat/lon 3x).
- Agent apni reading khud "approve" nahi karta — checker step JSON valid + consistent hone ki tasdeeq karta hai.

## Loop ke 6 parts is project mein
| Part | Yahan kya hai |
|------|---------------|
| Heartbeat | `/loop` — session khuli rahe |
| Worktree | Zaroorat nahi (single agent, read-only external data) |
| Skill | `SKILL.md` |
| Subagents | Maker = fetch+log; Checker = JSON/consistency verify |
| Connector | Public HTTP API (koi key nahi) |
| Spine | `spine.json` |
