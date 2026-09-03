# Project 6 - Local Rehearsal Verification (doorbell)

Reviewer: node review-local.js  (enforces review-checklist.md)

sample.diff (planted bugs):
  -> 4 findings, 4 blockers (B1 hardcoded key, B2 console.log, B4 TODO no-ref, B3 logic changed no test)
  -> exit code 1  => GitHub Action FAILS, review comment posts to PR

clean.diff (plain doc line):
  -> 0 blockers, 1 nit (trailing whitespace)
  -> exit code 0  => Action GREEN, "LGTM" comment

review.md generated = the exact body doorbell.yml posts via `gh pr comment --body-file review.md`.

6-part loop mapping:
  Heartbeat  = GitHub event (pull_request opened/synchronize) - here simulated by running the script
  Skill      = SKILL.md + review-checklist.md
  Maker      = the PR author (human/agent)  |  Checker = this reviewer (never merges, only grades)
  Connector  = gh CLI / pull-requests: write permission
  Spine      = the repo itself (Action reads it fresh each run)
  Stops      = blocker found -> exit 1 ; clean -> exit 0 ; own-bot PRs skipped (if condition in yml)

Course gotcha: green check != success. If doorbell.yml lacks `permissions: pull-requests: write`,
the job passes but the comment posts nowhere. Our yml has it set.

Real event-driven setup (not done): claude setup-token -> repo secret -> open PR -> ~60s review.
=> LOCAL REHEARSAL VERIFIED.
