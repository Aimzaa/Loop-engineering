# Break It On Purpose — Lab Notebook

Test loop: `loop-demo/loop.js` (run-until-done; goal = get work.value to 5).
Har break ek flag / file-move se; restore = flag hatao / file wapas.

| # | Component | Kaise toda | Expected failure | Asal mein kya hua | Restore verified? |
|---|-----------|------------|------------------|-------------------|-------------------|
| 1 | Stopping condition | `node loop.js --break stopcond` (success + retry-limit + stuck teeno off) | Loop kabhi nahi rukta, retry forever, tokens jalte hain | beat 5 pe goal hit hua par loop nahi ruka; 6,7,...40 tak bhaaga; `status=RUNAWAY`, exit 1 (sirf artificial 40-beat demo backstop ne roka) | [x] `node loop.js` -> 5 beats, success, exit 0 |
| 2 | Skill (`skill.md`) | `Rename-Item skill.md skill.md.bak` phir run | Agla beat bina project rules ke, generic/ghalat kaam | `skill: FILE MISSING -> maker has no STEP`; `value` 0 pe atka; beat 4 pe `STOP: stuck (3 beats no change)`; exit 1. Skill ke baghair koi progress nahi; stuck-stop ne runaway se bachaya | [x] rename back -> `skill: loaded (STEP=1)`, 5 beats, success |
| 3 | Maker–Checker split | `node loop.js --break checker` (maker khud "done" bolta hai) | Quality girti, bugs pass ho jate, self-approval | beat 1 pe `value=1` par `MAKER SELF-APPROVED`; `STOP: success`; **exit 0 (sab theek dikha!)** magar `value 1 != goal 5` -> ghalat result "success" ban kar nikla. WARNING line ne pakda | [x] `node loop.js` -> beat 5 pe asli success, koi WARNING nahi, exit 0 |
| 4 | Connector permission | `doorbell.yml` se `pull-requests: write` hatao | Job green, magar comment kahin post nahi hota | PENDING — live GitHub chahiye (NOTES.md PENDING section) | [ ] |
| 5 | Spine (`spine.json`) | `Rename-Item spine.json spine.json.bak` phir run | Pichle run ki memory gayab, again-from-zero | `spine: none yet -> first run`; 7 runs ki history gayab; naya `spine.json` sirf `runs: 1`. Loop ne yeh run solve kiya par pichla record khatam | [x] `Move-Item .bak back -Force` -> `spine: loaded (prior runs=7)`, run 8 append, exit 0 |

## Nateeja
- **Sabse "khatarnak" missing part:** Maker–Checker split (#3). Baaki breaks fail LOUD hote hain (RUNAWAY / stuck / no-memory, exit 1). Checker hatao to loop **exit 0** deta hai — sab theek lagta hai — jabke kaam ghalat hai. Silent wrong > loud wrong.
- **Har part ek makhsoos failure rokta hai:**
  - Stopping condition -> infinite retry / token burn
  - Skill -> blind beat, wrong/zero progress
  - Checker -> self-approval, wrong result passed as success
  - Connector -> work done but result never delivered
  - Spine -> memory loss, work repeats from zero
- **Restore:** har break sirf ek flag/file-move tha, isliye recovery foran (har case mein verify kiya).
