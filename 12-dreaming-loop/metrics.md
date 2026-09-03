# Dreaming Loop - Metrics

Ground truth: 9 planted patterns in scan-target/payments.js.

| Day | Skill version | Caught | Missed | Next pattern the scan asked for |
|-----|---------------|--------|--------|----------------------------------|
| 1 | day-1.md | 3/9 | 6 | sql-concat |
| 2 | day-2.md | 4/9 | 5 | empty-catch |
| 3 | day-3.md | 5/9 | 4 | await-loop |
| 4 | day-4.md | 6/9 | 3 | no-timeout |
| 5 | day-5.md | 7/9 | 2 | loose-eq |
| 6 | day-6.md | 8/9 | 1 | log-pii |
| 7 | day-7.md | 9/9 | 0 | - |

## Result
- Day 1 caught **3/9**; Day 7 caught **9/9**.
- The loop never rewrote itself. Each morning a human added the one pattern the previous night Missed.
- Day-1 skill: secret, eval, weak-random
- Day-7 skill: secret, eval, weak-random, sql-concat, empty-catch, await-loop, no-timeout, loose-eq, log-pii
