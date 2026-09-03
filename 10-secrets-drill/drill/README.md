# Project 10 - Secrets Drill (local)

Course ke 8 steps mein se 2 (Routine web UI ka "Secrets and Environment" panel) Routines-only hain.
Baaki 6 ka **core** yahan drill hota hai: env-ref not hardcode, connector call succeeds, secret masked
in output, kuch git/files mein leak nahi.

## Files
| File | Kya |
|------|-----|
| `use-secret.js` | ek loop-beat jo `process.env.DRILL_TOKEN` se secret leta hai, connector call karta hai, output/disk pe **mask** karta hai. Missing secret ya self-hardcode -> FAIL |
| `bad-example.js` | ANTI-PATTERN (hard-coded token). Sirf isliye hai ke `leak-hunt.js` ise pakde. Kabhi commit mat karo |
| `leak-hunt.js` | folder (+ optional `--git` history) ko secret-shaped strings ke liye scan karta hai. exit 0 = clean |
| `.gitignore` | `outbox/`, `*.env`, `*.local` ignore |

## Drill steps (course step -> local)

| Course step | Local |
|-------------|-------|
| 1-2. Routine UI "Secrets and Environment" mein secret add | **PENDING** (Routines-only) |
| 3. secret ko `${TOKEN}` se reference, hard-code nahi | `use-secret.js` `process.env.DRILL_TOKEN` |
| 4. Routine chalao, connector call SUCCESS | `$env:DRILL_TOKEN=...; node use-secret.js` -> OK |
| 5. transcript mein secret masked | output: `token ****3210 (len 30)` + `outbox/request-*.json` mein `Bearer ****3210` |
| 6. skill git commit -> file mein koi secret nahi | `node leak-hunt.js` (+ `--git`) -> CLEAN (after removing bad-example) |
| 7. secret rotate + re-run -> loop still works | `$env:DRILL_TOKEN` badlo, `node use-secret.js` -> OK, **koi code change nahi** |

## Running (one-by-one - README order, PowerShell)
Use any throwaway string as the fake token (e.g. `drilltok_live_` + random). Never put a real one here.
```
cd "E:\loop engineering project\10-secrets-drill\drill"
node use-secret.js                          # FAIL - no secret in env
$env:DRILL_TOKEN = "<FAKE-TOKEN>"           # "add the secret" (env only, never a file)
node use-secret.js                          # OK - masked
node leak-hunt.js                           # DIRTY - catches bad-example.js
Remove-Item bad-example.js                  # never commit the anti-pattern
node leak-hunt.js                           # CLEAN
git init -q -b main; git add -A; git -c user.email=lab@local -c user.name=lab commit -q -m "secrets drill"
node leak-hunt.js --git                     # CLEAN (history too)
$env:DRILL_TOKEN = "<FAKE-TOKEN-2>"         # rotate
node use-secret.js                          # still OK - no code change
```

## Common mistake (course)
Secret ko seedha skill/prompt mein paste karna, phir git commit. `bad-example.js` = exactly that.
