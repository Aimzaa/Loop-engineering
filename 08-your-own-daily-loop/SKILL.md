---
name: daily-triage
description: Har weekday subah <PROJECT> ke overnight signals (CI, issues, PRs, error alerts) dekho, triage rules lagao, ek action-oriented summary Slack par post karo, spine mein state rakho.
---

# Daily Triage — Skill  (apne project ke hisaab se bharo)

## Context
- Project / repo: `<OWNER/REPO>`
- Slack channel: `<#channel>`
- Kaam ke ghante / timezone: `<TZ>`

## Triage rules (apne — ye sirf misaal)
- P0: production error rate > `<X>` ya main branch CI red -> summary mein sabse upar, `@here`.
- P1: naya bug issue with `<label>` -> list karo, owner suggest karo.
- P2: PR jo `<N>` din se review ka muntazir -> nudge list.
- Ignore: dependabot noise, `<label:wontfix>`, draft PRs.

## Har run par steps
1. `spine.md` parho -> kal ke open P0/P1 yaad karo.
2. Overnight window (pichla weekday 6pm se aaj 9am) ke signals lo.
3. Rules lagao, items ko P0/P1/P2 mein baanto.
4. Summary (<= 15 lines): `P0 / P1 / P2` sections, har item ek line + link + suggested next step.
5. `<#channel>` par post karo.
6. `spine.md` mein aaj ka block append: date, counts, kaunse P0/P1 abhi khule hain.

## Stopping conditions
- Success: post + spine update -> exit clean.
- Retry limit: koi connector 3x fail -> spine mein error log, exit non-zero, koi aधूरा post nahi.
- Duplicate guard: aaj ki date ka block already ho -> skip.
- Quiet day: kuch nahi mila -> "Quiet overnight — nothing to triage." post karo, spine phir bhi update.

## Maker–Checker
- Checker: post se pehle verify — koi `<placeholder>` baaki nahi, P0 item hai to `@here` laga hai,
  spine ka aakhri block aaj ka hai.

## Weekly improvement (Project 12 ka beej)
Har Friday: `run-log.md` dekho, jo "missed" tha use naye rule ki shakl mein upar `Triage rules` mein add karo.
