# Project 10 - Secrets Drill Verification

| Course step | Local check | Result |
|-------------|-------------|--------|
| loop needs the secret | `node use-secret.js` with no env var | FAIL, exit 1 ("not in environment") |
| 3. env-ref, not hard-code | `$env:DRILL_TOKEN=...; node use-secret.js` | OK, exit 0 |
| 4. connector call succeeds | wrote `outbox/request-1.json` | OK |
| 5. secret masked in output | console: `token ****3210 (len 30)` | masked |
| 5. secret masked on disk | `request-1.json` -> `"Bearer ****3210 (len 30)"` | masked |
| leak looks like...? | `node leak-hunt.js` with `bad-example.js` present | DIRTY, 2 hits at bad-example.js:11, exit 1 |
| 6. no secret in files | `Remove-Item bad-example.js; node leak-hunt.js` | CLEAN, exit 0 |
| 6. no secret in git history | `git commit` + `node leak-hunt.js --git` | CLEAN, exit 0 |
| 7. rotate + re-run | `$env:DRILL_TOKEN="...ROTATED..."; node use-secret.js` | OK, `****cc33`, request-2.json, NO code change |

Steps 1-2 (Routine web UI "Secrets and Environment" panel) = PENDING (Routines/Max plan).
=> LOCAL DRILL VERIFIED.
