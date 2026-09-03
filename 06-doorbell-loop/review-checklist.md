# PR Review Checklist (Doorbell isko enforce karta hai)

Har item par diff ko parkho. Finding mile to severity do.

## Blockers (ye ho to review "changes requested")
- B1: Secrets/keys/passwords hardcoded (`API_KEY=`, `password =`, `.pem`, tokens)
- B2: `console.log` / `print` / debug dump jo production code mein reh gaya (non-test files)
- B3: Test file bilkul touch nahi hui jabke logic file badli hai
- B4: `TODO` / `FIXME` / `XXX` naye code mein bina issue link ke
- B5: Commented-out bada code block (>5 lines) add hua
- B6: Breaking change public API mein bina version/CHANGELOG note

## Warnings
- W1: Function > 60 lines add/modify hua (split karne ka mashwara)
- W2: `catch` block khali ya sirf swallow karta hai
- W3: Magic number bina naam ke (except 0/1/-1)
- W4: Naya dependency add hua `package.json` mein (justify karo)
- W5: `any` type (TS) naye code mein

## Nits
- N1: Trailing whitespace / mixed indentation
- N2: Naam typo ya non-descriptive (`data2`, `tmp`, `foo`) production code mein
- N3: Missing newline at end of file

## Output format (review.md)
```
## Doorbell review — <total> findings (<b> blockers, <w> warnings, <n> nits)

### Blockers
- `path/file.js:42` — B1 — Hardcoded API key. Move to env var / secret.

### Warnings
- `path/file.js:88` — W1 — `handleAll()` is 74 lines. Consider splitting.

### Nits
- `path/file.js:5` — N3 — No newline at EOF.

_Checker only — merge decision stays with a human._
```
