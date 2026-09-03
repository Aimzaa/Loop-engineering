# Secrets Drill — Checklist

| # | Step | Done | Note |
|---|------|------|------|
| 1 | Routine `claude.ai/code/routines` mein khuli | [ ] | |
| 2 | "Secrets and Environment" section mila | [ ] | |
| 3 | `SLACK_TOKEN` (ya jo bhi) asli value ke saath add kiya | [ ] | |
| 4 | Skill/prompt mein `${SLACK_TOKEN}` reference (hard-code nahi) | [ ] | |
| 5 | Routine chali, connector call SUCCESS | [ ] | |
| 6 | Session transcript mein secret **masked** (`****`) | [ ] | |
| 7 | Skill git commit — `git show HEAD` mein koi secret nahi | [ ] | |
| 8 | Secret rotate kiya + dobara chalaya — loop still works | [ ] | |

## Leak hunt commands
```
git log -p | grep -iE "xox[bp]-|sk-(live|proj)|ghp_|api[_-]?key\s*[:=]" || echo "history: clean"
grep -rniE "xox[bp]-|sk-(live|proj)|ghp_" . --exclude-dir=.git || echo "working tree: clean"
```

## Nateeja
- Secret kahin plaintext mila? kahan:
- Rotation ke baad koi code change chahiye tha? (nahi hona chahiye):
