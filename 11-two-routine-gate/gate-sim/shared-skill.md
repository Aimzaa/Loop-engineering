# Two-Routine Gate - Shared Skill

Dono routines (maker + checker) yehi file parhte hain. Ek hi source of truth.

## Repo
- Target file: `main/config.js` (+ `main/config.test.js`)
- Spine (dono ke beech ka wahid raabta): `progress.md`
- PRs yahan bante hain: `prs/pr-<n>/`  (config.js + meta.json)

## Scope - sirf "safe" changes
Allowed:
- ek numeric literal ki value badalna
- comment add/edit karna

NOT allowed (out of scope -> checker FAIL):
- `function ...` signature / parameter list badalna
- `module.exports` badalna
- naya require / dependency

## Checker PASS rubric (SAB zaroori)
1. PR sirf `config.js` ko chhuta hai
2. Changed lines <= 6
3. Koi changed line `function `, `module.exports`, ya param-list ko nahi chhoती - sirf number/comment
4. `node --test` PR version par PASS (0 fail)
5. Har change ka `meta.json` mein `issue` reference hai

PASS -> checker PR ko `main/` mein merge karta hai, `progress.md`: `Checker verdict: PASS (merged)`
FAIL -> PR khula rehta hai, `progress.md`: `Checker verdict: FAIL - <reason>`, comment.

## progress.md block format
```
## YYYY-MM-DD
- PR: pr-<n>
- Task: <issue> <what>
- Maker done: <time>
- Checker verdict: (pending)
```
