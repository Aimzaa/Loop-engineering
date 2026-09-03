---
name: doorbell-pr-review
description: Jab bhi koi Pull Request khule ya update ho, us PR ka diff review karo checklist ke against, aur ek structured review comment post karo. Maker (PR author) se alag checker.
---

# The Doorbell — PR Review Skill

## Maqsad
Ye **event-driven** loop hai. Koi timer nahi — "doorbell" tab bajti hai jab GitHub pe
PR `opened` ya `synchronize` (naya push) event aata hai. Tab review agent uth kar diff dekhta hai.

## Trigger
- GitHub Actions workflow: `.github/workflows/doorbell.yml` (is folder mein template maujood).
- Events: `pull_request: [opened, synchronize, reopened]`.

## Har event par steps (checker agent)
1. PR ka diff lo: `gh pr diff <number>` (ya event payload se).
2. Changed files ki list + additions/deletions summary banao.
3. `review-checklist.md` ke har item ke against diff ko parkho.
4. Findings ko severity dein: `blocker` / `warning` / `nit`.
5. Ek hi review comment post karo (`gh pr comment <number> --body-file review.md`):
   - Summary line (kitne blocker/warning/nit)
   - Har finding: `file:line — severity — kya masla — suggested fix`
   - Agar kuch na mile: "LGTM — checklist clean."
6. `spine.json` update karo: `{ pr, sha, event, findings_count, verdict, ts }` append.

## Stopping conditions
- **Success (per event):** review comment post ho gaya + spine updated -> is event ka kaam khatam.
- **Retry limit:** `gh` ya diff fetch 3 dafa fail -> event ko `errored` mark karo, exit non-zero (Action red).
- **Duplicate guard:** agar isi `sha` ke liye review pehle post ho chuki hai -> skip (spine mein sha check).
- **Loop guard:** apne hi bot comment pe react mat karo (event author == bot -> ignore).

## Maker–Checker (yehi is project ka asli sabaq)
- **Maker** = PR ka author (insaan ya doosra agent). Wo apni PR ko merge/approve nahi karwa sakta is loop se.
- **Checker** = ye review agent. Sirf review deta hai, merge nahi karta.
- Approve/merge ka faisla insaan ka — loop sirf grade karta hai.

## Local test (GitHub ke baghair)
`node review-local.js <path-to-diff-file>` — ek diff file par checklist chala kar `review.md` banata hai.
