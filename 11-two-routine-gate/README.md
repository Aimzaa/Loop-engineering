# Project 11 — Build the Two-Routine Gate

**Course goal:** Maker–checker pattern ko **do alag Routines** mein implement karo — ek Routine change propose kare,
doosri use merge se pehle review kare.
**Heartbeat:** Scheduled (do independent Routines, 30 minute ke faasle par)
**"Done" ka matlab:** Maker Routine 9:00am tak PR kholti hai. Checker Routine 9:30am tak review karti hai.
Pass -> auto-merge; Fail -> comment post kare aur PR khula chhod de tumhare review ke liye.

## Course ke steps
1. **Maker Routine** (9:00am):
   - Triage skill chalati hai
   - Overnight issues dhoondti hai
   - `claude/morning-triage` branch par fixes ke saath PR kholti hai
   - Spine file (`progress.md`) mein summary likhti hai
2. **Checker Routine** (9:30am):
   - Spine file parh kar PR number nikalti hai
   - Branch clone karke tests chalati hai
   - "PASS" ya "FAIL" comment karti hai
   - PASS -> PR merge; FAIL -> tumhare liye chhod deti hai
3. Dono Routines **same skill** use karti hain (consistency).
4. Ek Routine parhti hai jo doosri ne likha (spine ke zariye).
5. Dono ko 3 din live chalao aur gate ke faisle record karo.

## Key pattern (course)
"Jo agent code likhta hai wo wo agent nahi jo use grade karta hai."

## Is folder mein
- `maker-routine.md` — maker Routine ka prompt.
- `checker-routine.md` — checker Routine ka prompt.
- `shared-skill.md` — dono jo skill share karti hain.
- `progress.md` — spine (maker likhti, checker parhti).
- `gate-log.md` — 3 din ke faisle.

## Zaroori
- Claude Max plan (2 Routines), ek asli repo jahan CI/tests chalte hon.
