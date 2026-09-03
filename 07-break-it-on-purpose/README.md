# Project 7 — Break It On Purpose

**Course goal:** Ek chalte hue loop mein jaan-boojh kar failures daalo taake samajh aaye har component kis cheez se bachata hai.
**Heartbeat:** Conditional (run-until-done with `/goal`)
**"Done" ka matlab:** Har failure type trigger karo, breakdown dekho, phir loop ko working state pe wapas laao.

## Course ke steps (Project 6 ke doorbell loop par karo)
1. Project 6 ka working loop lo.
2. **Stopping condition hatao** aur dobara chalao -> loop hamesha retry karta rahega (dekho).
3. **Skill file delete karo** mid-run -> agla beat "andha" shuru hota hai (koi project knowledge nahi).
4. **Maker-checker split hatao** (bina reviewer chalao) -> quality girti hai (note karo).
5. **Connector permission toro** (`pull-requests: write` hatao) -> PR post nahi ho sakta.
6. **Spine file delete karo** -> kal ka kaam gaya (state nahi rahi).
7. Har component **wapas restore** karo aur tasdeeq karo loop recover karta hai.

## Is folder mein
- `experiments.md` — har break ke liye: kya hataya, kya expected, kya asal mein hua (fill karo).
- `checklist.md` — 5 parts × (break -> observe -> restore -> verify) grid.

## Key lesson (course)
"Har 5 parts mein se har ek ek makhsoos tareeqe ki failure rokta hai" — bina us part ke loop kahan
toota, wahi us part ka maqsad hai.

> Ehtiyaat: ye experiments apne test repo/loop par karo, kisi asli production loop par nahi.
