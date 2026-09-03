# Project 6 — The Doorbell Loop (Event-Driven Heartbeat)

**Course goal:** PR khulte hi khud-ba-khud review ho jaye — koi prompt type nahi, koi insaan dekh nahi raha, laptop band.
**Heartbeat:** Event-driven (GitHub trigger)
**"Done" ka matlab:** PR khulne ke ~1 minute ke andar review comment aa jaye.

## Course ke steps
1. Doorbell project ko apni repo mein clone/copy karo (is folder ki `.github/workflows/doorbell.yml` use karo).
2. Token banao:
   ```bash
   claude setup-token
   ```
3. Token ko **repository secret** ke tor par add karo (e.g. `CLAUDE_CODE_OAUTH_TOKEN`).
4. Ek pull request kholo jisme jaan-boojh kar ek bug ho.
5. 60 second ke andar automated review comment aa jaye jo us masle ka zikr kare.
6. **Unattended proof:** apna laptop band karo, kisi aur se PR khulwao — review phir bhi aata hai.

## ⚠️ "Green checkmark ≠ success"
Course kehta hai: ek setting aisi hai jo chup-chaap review ko kahin post nahi karne deti,
jabke Action green dikhta hai. Wo setting: **workflow ki `permissions:` block**.
Agar `pull-requests: write` (aur `contents: read`) na ho, to job pass ho jaati hai par
`gh pr comment` silently fail/no-op karta hai. `doorbell.yml` mein ye pehle se set hai — hataana mat.

## Local test (GitHub ke baghair)
```
cd "E:\loop engineering project\06-doorbell-loop"
node review-local.js sample.diff
```
`review.md` banta hai + exit code 1 (kyunki sample.diff mein hardcoded key hai = blocker).
Yehi logic Action ke andar `SKILL.md` ke steps se chalti hai.

## Files
- `.github/workflows/doorbell.yml` — event trigger + permissions (isko apni repo ke root pe copy karo).
- `SKILL.md` — review agent har event par kya kare.
- `review-checklist.md` — blockers / warnings / nits ki list.
- `review-local.js` + `sample.diff` — GitHub ke baghair rehearsal.

## Kya seekhna hai
- Loop kabhi tumhari machine par tha hi nahi — GitHub ne runner "kiraye" pe liya, kaam kiya, machine phenk di.
- Spine = repo khud (agent ne repo parh kar context uthaya).
- Maker (PR author) aur checker (review agent) alag — checker merge nahi karta, sirf grade karta hai.
