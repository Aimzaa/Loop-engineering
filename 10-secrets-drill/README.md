# Project 10 — The Secrets Drill

**Course goal:** API keys aur credentials ek Routine mein mehfooz tareeqe se add karo — bina logs ya repos mein leak kiye.
**Heartbeat:** Scheduled (koi bhi recurring Routine jo tumne pehle banayi — e.g. Project 3 ya 8)
**"Done" ka matlab:** Loop ek stored credential parhe, use connector call mein istemal kare, aur wo secret
kisi output ya version control mein kabhi na dikhe.

## Course ke steps
1. Apni Routine web UI mein kholo: `claude.ai/code/routines`
2. "Secrets and Environment" tak scroll karo.
3. Ek secret add karo (e.g. `SLACK_TOKEN`) asli value ke saath.
4. Skill prompt mein use `${SLACK_TOKEN}` ke tor par reference karo (hard-code **nahi**).
5. Routine chalao, connector call kamiyab hone ki tasdeeq karo.
6. Session transcript check karo — secret masked hona chahiye.
7. Skill git mein commit karo — file mein koi secret nahi aana chahiye.
8. Routine UI mein secret rotate karo aur dobara chalao — loop phir bhi kaam kare.

## Common mistake (course)
Secret ko seedha skill/prompt mein paste kar dena, phir git mein commit kar dena.

## Is folder mein
- `checklist.md` — 8 steps ka pass/fail grid + "leak hunt" commands.

## Leak hunt (drill ke baad chalao)
```
git log -p | grep -iE "xox[bp]-|sk-live|api[_-]?key" || echo "clean"
```
Session transcript / run output mein bhi `xox`, `sk-`, apna token prefix search karo — masked (`****`) hona chahiye.
