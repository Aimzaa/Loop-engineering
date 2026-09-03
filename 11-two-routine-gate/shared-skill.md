---
name: morning-triage-gate
description: Overnight issues ko chhoti, safe fixes mein badlo. Maker Routine isse PR kholne ke liye use karti hai; Checker Routine isse PASS/FAIL rubric ke liye use karti hai.
---

# Morning Triage Gate — Shared Skill

## Scope (dono Routines ke liye)
- Repo: `<OWNER/REPO>`
- Branch: `claude/morning-triage`
- Spine file: `progress.md` (repo root ya Routine storage mein)
- Sirf "safe" fixes: typo, null-check, flaky test stabilize, doc fix, dependency patch bump.
  Bade refactors / API changes = out of scope (sirf issue mein comment karo).

## MAKER ka kaam
1. Overnight `<label:triage>` issues lo.
2. Jo "safe fix" scope mein aata hai uske liye ek chhota patch banao.
3. `claude/morning-triage` par ek PR kholo (ek PR mein 1-3 chhote fixes max).
4. `progress.md` mein aaj ka block likho:
   ```
   ## YYYY-MM-DD
   - PR: #<num>
   - Fixes: <bullet list>
   - Maker done at: <UTC time>
   - Checker verdict: (pending)
   ```

## CHECKER ka kaam (PASS/FAIL rubric)
`PASS` ke liye SAB zaroori:
1. PR sirf `claude/morning-triage` ko target karta hai.
2. Sirf scope-allowed files chhue (koi API/schema/CI-config change nahi).
3. `<OWNER/REPO>` ki CI / `npm test` green.
4. Diff <= ~80 changed lines.
5. Har fix ka koi na koi issue reference hai.
Warna `FAIL` + wajah comment.

Checker actions:
- PASS -> PR merge karo, `progress.md` mein `Checker verdict: PASS (merged)`.
- FAIL -> PR khula chhodo, comment post karo, `progress.md` mein `Checker verdict: FAIL — <reason>`.

## Stopping conditions (dono)
- Success: apna kaam + spine update -> exit clean.
- Retry limit: git/CI/connector 3x fail -> spine mein error, exit non-zero.
- Duplicate guard: aaj ka block already complete -> skip.
- No-work guard: koi triage issue nahi -> maker "nothing to do" likhe, checker skip kare.
