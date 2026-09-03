# Checker Routine — setup

**Schedule:** `every weekday at 9:30am`  (maker se 30 min baad)
**Access:** sirf `<OWNER/REPO>`, read PR + run CI/tests + merge permission.

**Prompt:**
> Read `shared-skill.md`. Act as the CHECKER only. Read `progress.md` to get today's PR number.
> Check out that branch, run `npm test` (and wait for CI) yourself, and grade the PR against every
> numbered item in the skill's PASS rubric. If PASS: merge the PR and update `progress.md`
> (`Checker verdict: PASS (merged)`). If FAIL: leave the PR open, post a comment with the failing
> item(s), and update `progress.md` (`Checker verdict: FAIL — <reason>`).
> You did not write this code — do not "fix" it. Obey all stopping conditions.

**Note:** Checker ko maker ka session context nahi milta — sirf `progress.md` + PR. Yehi gate ka point hai.
