# Workflow Brief — "Review changed files across dimensions, verify each finding"

Ye woh kaam hai jise tum ek dobara-chalne-wali workflow bana kar codify karoge.

## Kaam
Ek target repo/branch ke changed files lo aur:
1. **Fan-out review:** 3 alag dimensions par parallel review —
   - `correctness` (bugs, edge cases, off-by-one)
   - `simplicity` (duplication, dead code, over-engineering)
   - `efficiency` (N+1, needless allocation, sync-in-loop)
2. **Verify:** har dimension ki har finding ko ek alag agent adversarially verify kare —
   `CONFIRMED` ya `REJECTED` + wajah. Jhoote positives gir jayein.
3. **Collect:** sirf `CONFIRMED` findings, severity ke hisaab se sorted, ek report mein.

## Pipeline shape (course ka canonical pattern)
- Dimension `correctness` ki findings verify hoti rahein jab `simplicity` abhi review ho raha ho —
  wall-clock zaaya na ho.

## Guardrails (stopping conditions)
- Total agents <= 15 (is session ki default guideline).
- Koi review agent 2 retries mein fail -> us dimension ko skip, baaki chalti rahe.
- Agar changed files 0 -> foran ruk jao, "nothing to review" likho.

## Test target
Is repo ke andar `02-make-tests-pass/sample-repo/` ya `04-fix-loop-checker/bug/` ko target banao —
dono mein jaan-boojh kar masle hain, findings aane chahiye.
