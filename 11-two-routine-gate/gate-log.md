# Two-Routine Gate - Decision Log

Local sim: `gate-sim/`. Live 2-Routine (9:00 maker / 9:30 checker) = NOTES.md PENDING.

| Day | Date | Maker PR | Task | Checker verdict | Merged? | Right call? |
|-----|------|----------|------|-----------------|---------|-------------|
| 1 | 2026-09-01 | pr-1 | #4101 TIMEOUT_MS 30000->60000 (number only) | PASS (merged) | yes | yes - in scope, tests pass, 1 line |
| 2 | 2026-09-02 | pr-2 | #4102 add `jitter` param to retry() | FAIL - signature change out of scope | no, PR left open + COMMENT.md | yes - rubric rule 3 (no function-signature changes) |

## Observations
- Checker ne maker ka out-of-scope kaam **pakda** (day 2) - gate ne galat merge roka.
- Dono processes waqai alag: checker ko PR id sirf `progress.md` se mila, maker ke process/output se nahi.
- Koi galat PASS/FAIL nahi - dono verdicts rubric se defensible.
- Idempotent: maker dobara chalao -> `SKIP` (aaj ka block hai); checker dobara -> `SKIP` (verdict already).
