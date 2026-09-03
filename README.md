# Loop Engineering — 12 Practice Projects

A complete, hands-on implementation of all twelve practice loops from
**[Loop Engineering: A Crash Course](https://agentfactory.panaversity.org/docs/loop-engineering-crash-course)**
(Panaversity / Agent Factory).

Every project is built and executed locally, with a written verification record for each. Where a
project's final step needs infrastructure that isn't available offline (a Claude Max plan for
Routines, a live GitHub repository, a Slack workspace), a faithful local rehearsal of the same loop
is provided and the remaining live step is documented — see [Current Status](#current-status).

---

## Table of Contents

- [Project Overview](#project-overview)
- [What Is Loop Engineering](#what-is-loop-engineering)
- [What Is a Loop — The Six Parts](#what-is-a-loop--the-six-parts)
- [The Four Heartbeats](#the-four-heartbeats)
- [The Twelve Projects](#the-twelve-projects)
- [Project Concepts — What Each One Demonstrates](#project-concepts--what-each-one-demonstrates)
- [Core Concepts Covered](#core-concepts-covered)
- [Technology & Stack](#technology--stack)
- [Verification & Testing Summary](#verification--testing-summary)
- [Real Issues Encountered](#real-issues-encountered)
- [Current Status](#current-status)
- [Repository Layout](#repository-layout)
- [Running the Projects](#running-the-projects)
- [Author](#author)

---

## Project Overview

Loop engineering is the discipline of building systems where an AI agent works **autonomously and
repeatedly** — you own the intent and the accountability, not every keystroke. This repository works
through that discipline project by project, from a five-minute in-session watcher up to a self-improving
"dreaming" loop.

Each of the twelve folders (`01-*` … `12-*`) is a self-contained loop with its own `README.md`
(course goal, heartbeat, definition of "done", how to run) and, where applicable, a
`VERIFIED-by-me.md` / `SUMMARY.md` capturing the actual run.

**Design constraints held throughout:**

- **Zero runtime dependencies.** Everything runs on the Node.js standard library (`node:test`,
  global `fetch`, `AbortSignal.timeout`). No `npm install`.
- **Every loop has a real stopping condition** — success, retry limit, and stuck detection.
- **Maker ≠ Checker.** The code that produces work never grades it; a separate process or agent does.
- **State lives in a spine file** (`spine.json` / `spine.md` / `progress.md`) so memory survives
  between runs.
- **Public data, no API keys** — the ISS position APIs and the GitHub public REST API.

---

## What Is Loop Engineering

The shift is from *prompting each turn* to *designing a system that prompts itself*.

| | You used to | You now |
|---|---|---|
| **Do** | write every prompt, read every reply, write the next prompt | define "done" as a checkable condition, then let the loop run |
| **Keep** | — | **intent** (what "done" means) and **accountability** (you own the result) |

> The loop is only as good as its stopping condition.

---

## What Is a Loop — The Six Parts

Every functional loop in this repo is built from the same six parts:

| Part | Role | Where it shows up here |
|---|---|---|
| **Heartbeat** | what starts each run | `/loop` timer, `/goal` condition, in-session cron, a GitHub event, a nightly schedule |
| **Worktree** | isolated checkout so parallel agents don't collide | `git worktree` in Project 4 |
| **Skill** | project knowledge written once | `SKILL.md` in most folders |
| **Subagents** | separate maker and checker — never self-approve | every project; explicit in 4, 5, 11 |
| **Connector / MCP** | reach external tools | public HTTP APIs; GitHub Actions in Project 6 |
| **Spine** | state file that persists memory between runs | `spine.json`, `spine.md`, `progress.md` |

---

## The Four Heartbeats

| Heartbeat | Fires when | Laptop can be off? | Used in |
|---|---|---|---|
| **In-session** (`/loop`) | a timer, while the session is open | No | Project 1 |
| **Conditional** (`/goal`) | a checked condition becomes true | No | Projects 2, 4, 5, 7 |
| **Scheduled** (Routine / cron) | a clock time | Yes | Projects 3, 8, 9, 10, 11, 12 |
| **Event-driven** (GitHub / API) | something happens | Yes | Project 6 |

---

## The Twelve Projects

| # | Project | Heartbeat | Concept it proves | Status |
|---|---|---|---|---|
| 1 | **Watch Loop** | in-session `/loop` | a heartbeat lives inside the open session; kill the session, kill the loop | Complete |
| 2 | **Make the Test Pass, Then Stop** | conditional `/goal` | "done" is a command's exit code, not an opinion; a second model confirms | Complete |
| 3 | **The Morning Brief with a Memory** | scheduled | the spine carries memory between runs (what's NEW / FIXED / STILL OPEN) | Local rehearsal complete · live Routine pending |
| 4 | **A Fix Loop with a Real Checker** | conditional + worktree | the maker works in an isolated worktree; a separate checker grades against a rubric | Complete |
| 5 | **Codify the Body** | dynamic workflow | turn-by-turn orchestration becomes a saved, re-runnable multi-agent script | Complete |
| 6 | **The Doorbell Loop** | event-driven (GitHub) | the loop never existed on your machine — GitHub rents a runner, reads the repo, throws the machine away | Local rehearsal complete · live setup pending |
| 7 | **Break It on Purpose** | conditional | each of the six parts prevents one specific failure mode | 4 of 5 breaks complete · connector break pending |
| 8 | **Your Own Daily Loop** | scheduled | an unattended triage loop with real rules, running for a business week | Local rehearsal complete · live Routine pending |
| 9 | **Rehearse a Routine for Free** | scheduled (one-off) | one-off runs don't burn the daily quota — validate three times before scheduling | Pending (Routines only) |
| 10 | **The Secrets Drill** | scheduled | a credential is read from the environment, used, and never printed or committed | Local drill complete · Routine UI step pending |
| 11 | **Build the Two-Routine Gate** | two scheduled routines | maker and checker are two independent processes that talk only through the spine | Local simulation complete · live routines pending |
| 12 | **Build a Dreaming Loop** | scheduled nightly | the loop doesn't rewrite itself — you do, using what it missed last night | Complete |

---

## Project Concepts — What Each One Demonstrates

### 01 · Watch Loop
An in-session `/loop` (backed by a one-minute in-session cron) fetches the International Space
Station's live position every beat, appends it to `spine.json`, compares against the previous
reading, and a separate `check.js` verifies the append. It stops itself after 10 beats and writes
`SUMMARY.md`. **Takeaway:** the heartbeat is tied to the open session; retry-limit and
stuck-detection stops are armed even though only the success stop fires.

### 02 · Make the Test Pass, Then Stop
A `/goal` loop over a small `auth` module with four failing tests and two lint errors. The condition
is provable — `npm test` and `npm run lint` both green — and only `src/auth.js` may change. A
second model answers "are we done?" after every turn. **Takeaway:** stopping conditions must be
machine-checkable; a retry limit protects the token budget.

### 03 · The Morning Brief with a Memory
A scheduled loop that pulls overnight signals (recently updated issues + failed CI runs) from a
public GitHub repository, diffs them against the previous run's spine block, and writes a
NEW / FIXED / STILL OPEN brief. The "Slack post" is a local `outbox/` file — the connector seam.
**Takeaway:** without the spine, every run would report everything as new.

### 04 · A Fix Loop with a Real Checker
The maker creates a `git worktree`, fixes a genuine bug in a `paginate` library there (leaving the
original untouched), and commits. A **separate** `check.js` process re-runs the tests, inspects
`git diff` to confirm the tests weren't touched, and grades against a five-point rubric. The loop
merges only on `PASS`. **Takeaway:** isolation plus an independent grader prevents self-approval.

### 05 · Codify the Body
A dynamic multi-agent workflow: three dimension reviewers (correctness / simplicity / efficiency)
fan out over two target files, then every finding is handed to a separate skeptic agent prompted to
**refute** it. Only `CONFIRMED` findings survive. Run twice — 13 agents then 11 agents, different
numbers each time, proving it is live orchestration and not a cached result. **Takeaway:** the
orchestration "body" becomes a saved script instead of hand-typed turns.

### 06 · The Doorbell Loop
An event-driven review: a GitHub Actions workflow (`.github/workflows/doorbell.yml`) fires on
`pull_request` and runs the review checklist. Locally rehearsed with `review-local.js` against a
buggy diff (four blockers, exit 1) and a clean diff (exit 0). **Takeaway:** the loop runs on a
rented runner that reads the repo — the repo *is* the spine. The `permissions: pull-requests: write`
line is the setting that silently makes the review post nowhere if omitted.

### 07 · Break It on Purpose
A minimal run-until-done loop (`loop-demo/loop.js`) with all parts visible, then each is broken via
a flag and restored:

| Break | Observed failure |
|---|---|
| stopping condition removed | loop blows past the goal, runs to a demo backstop — **RUNAWAY** |
| skill file deleted | maker has no step, no progress — **stuck-detection** stop catches it |
| maker/checker split removed | maker self-approves at beat 1 — **exit 0 with a wrong result** |
| spine file deleted | prior run history gone — loop thinks it's run #1 |
| connector permission broken | *(needs the live doorbell — pending)* |

**Takeaway:** the maker/checker break is the dangerous one — it fails *silently*.

### 08 · Your Own Daily Loop
A triage loop with editable `rules.json` (P0 / P1 / P2 + ignore) run over a simulated five-business-day
arc: a crash report appears, gets fixed, a quiet day, a security report appears. The spine carries
each day's open P0/P1 forward so the next day can compute FIXED. **Takeaway:** rules are intent;
the run log feeds next week's rules.

### 09 · Rehearse a Routine for Free
Pure Routines mechanic (no local analogue): one-off `/schedule` runs don't count against the daily
cap, so a prompt is validated three times — same prompt / different time / small edit — before the
recurring schedule is enabled. Documented in `routine-prompt.md` and `decision.md`.

### 10 · The Secrets Drill
`use-secret.js` reads a token only from `process.env`, uses it in a connector call, and masks it in
every output and on disk (`Bearer ****3210`). `leak-hunt.js` scans the working tree and
`git log` for secret-shaped strings; it catches the deliberate `bad-example.js`, which is then
removed. Rotating the token is one environment change with **no code edit**. **Takeaway:** the
anti-pattern is pasting the secret into the skill and committing it.

### 11 · Build the Two-Routine Gate
`maker-routine.js` (a "09:00" job) opens a patch as a PR and writes a block to `progress.md`.
`checker-routine.js` (a separate "09:30" process) learns the PR number **only** from `progress.md`,
grades it against the shared skill's rubric, then merges on PASS or leaves the PR open with a
comment on FAIL. Day 1 (a numeric change) merges; day 2 (a function-signature change) is rejected as
out of scope. **Takeaway:** the agent that writes the code is not the agent that grades it.

### 12 · Build a Dreaming Loop
`scan.js` reads the current `SKILL.md` pattern list and scans a payments module with nine planted
risky patterns, recording Found / Missed in `progress.md`. Each "morning" a human adds the one
pattern that was missed. Over seven days the catch rate climbs **3/9 → 9/9**. **Takeaway:** the loop
never edits itself; each miss teaches the human what to tell it next.

---

## Core Concepts Covered

- **The six-part loop** — heartbeat, worktree, skill, subagents, connector, spine
- **The four heartbeats** — in-session, conditional, scheduled, event-driven
- **Stopping conditions** — success condition, retry limit, stuck detection (every unattended loop needs all three)
- **Maker–checker separation** — the producer never approves its own work; a separate process or agent grades it
- **The spine** — durable state that carries memory between runs; idempotent / duplicate-guarded writes
- **Spec-driven "done"** — a condition a command can prove, not a subjective judgement
- **Worktree isolation** — parallel work without collision
- **Dynamic workflows** — codifying orchestration as a re-runnable multi-agent script with guardrails
- **Adversarial verification** — independent skeptics refuting findings to kill plausible-but-wrong results
- **Event-driven execution** — work that runs on a rented runner and reads the repo as its context
- **Secret hygiene** — environment references, output masking, leak scanning, rotation without code change
- **Human-in-the-loop improvement** — the loop reports; the human refines the skill

---

## Technology & Stack

| Area | Used |
|---|---|
| **Runtime** | Node.js v24 — built-in `node:test`, global `fetch`, `AbortSignal.timeout`; **no npm dependencies** |
| **Agent tooling** | Claude Code — `/loop`, `/goal`, in-session cron, the Workflow tool (multi-agent orchestration), `git worktree` |
| **CI / events** | GitHub Actions (`anthropics/claude-code-action`) for the doorbell loop |
| **External data (no keys)** | `wheretheiss.at` + `api.open-notify.org` (ISS position); GitHub public REST API (issues + Actions runs) |
| **State format** | JSON and Markdown spine files |
| **Shell / OS** | PowerShell and Git Bash on Windows 10 |
| **Pending live infrastructure** | Claude Routines (Max plan), a dedicated GitHub repository, a Slack workspace |

---

## Verification & Testing Summary

| # | What was verified | Result |
|---|---|---|
| 1 | 10 beats, checker PASS on each, self-stop on success, `SUMMARY.md` written | Pass |
| 2 | `npm test` 6/6 green, `npm run lint` clean, only `src/auth.js` changed | Pass |
| 3 | 2-day rehearsal; checker PASS both days; NEW/FIXED computed from the prior spine block; idempotent guard fires on re-run | Pass |
| 4 | Fix made in an isolated worktree (original still failing); separate `check.js` PASS on all 5 rubric items; merged | Pass |
| 5 | Two live workflow runs — 13 agents (10 raised / 6 confirmed) and 11 agents (8 raised / 5 confirmed), 0 errors; counts cross-checked against `journal.jsonl` | Pass |
| 6 | Buggy diff → 4 blockers, exit 1; clean diff → exit 0; `review.md` generated | Pass |
| 7 | 4 of 5 breaks triggered and each restored: RUNAWAY, stuck, silent-wrong-exit-0, memory-loss | Pass (4/5) |
| 8 | 5-day unattended arc; checker PASS all 5 days; spine carried open P0/P1 forward; `run-log.md` filled | Pass |
| 10 | No-env → FAIL; masked in console and on disk; `leak-hunt` DIRTY → removed anti-pattern → CLEAN (tree + git history); rotate with no code change | Pass |
| 11 | Day 1 numeric change → checker PASS → merged; day 2 signature change → checker FAIL → PR left open + `COMMENT.md`; two independent processes | Pass |
| 12 | 7-day arc, catch rate 3/9 → 9/9; loop never self-modified; `metrics.md` written | Pass |

---

## Real Issues Encountered

Actual problems hit while building, and how they were resolved.

**Bugs the loops were built to fix (the exercises themselves):**

- **Project 2** — `validatePassword` used `>` instead of `>=`; `isExpired` had its comparison
  inverted; `normalizeEmail` never trimmed; a stray `console.log` and a `var` in `src/auth.js`.
- **Project 4** — `paginate()` computed `page * perPage` on a 1-indexed contract (page 1 skipped
  the first page); `pageCount()` used `Math.floor` and dropped the trailing partial page.
- **Project 5** — the workflow independently confirmed real defects in the target files:
  `eval()` on a config string, SQL built by concatenation, an empty `catch` that swallows a failed
  charge, a bank `fetch()` with no timeout, plus both paginate bugs (surfaced by two lenses).

**Tooling / environment issues fixed during the build:**

- **`node --test` and directory paths** — on Node 24, `node --test test/` treats `test/` as a
  module to load and fails with `Cannot find module .../test`. Switched to a quoted glob:
  `node --test "test/**/*.test.js"`.
- **Silent exit on PowerShell (Project 3)** — `build-brief.js` tried to read stdin (fd 0) even when
  `--fixture` was passed and nothing was piped, which hangs / returns oddly on a PowerShell console.
  Fixed so an explicit `--fixture` path always wins and stdin is read only when
  `!process.stdin.isTTY`.
- **Checker false positive (Project 3)** — a "no leftover `<placeholder>`" check matched a real
  GitHub issue title containing `--view <number>`. Narrowed it to flag only ALL-CAPS
  `<PLACEHOLDER>` tokens.
- **`npm` from `execFileSync` on Windows (Project 4)** — `execFileSync("npm", …)` fails because
  `npm` is `npm.cmd` and needs a shell. The checker now invokes `node --test` directly.
- **Self-flagging drill (Project 10)** — the leak scanner and an internal guard matched the sample
  token that appeared in a usage comment / README. Docs switched to placeholders; the guard was
  scoped to the loop file itself.
- **Zero-length regex match (Project 11)** — the checker's block-extraction lookahead
  `(?=\n## |\n*$)` matched immediately at end-of-line under the `m` flag, so the checker read an
  empty block. Replaced with a split on `/(?=^## )/m`.
- **Backslashes eaten by a heredoc (Project 12)** — generating regex strings through a shell
  heredoc dropped a level of escaping (`sk_live_\w+` became `sk_live_w+`). Rewrote the generator as
  a Node script using `String.raw`.
- **Temporal dead zone (Project 12)** — `reset.js` referenced a `const` before its declaration;
  moved the declaration to the top.
- **Console mojibake** — em dashes rendered as `â€"` under PowerShell `Get-Content`; generated
  output was normalized to ASCII hyphens.

---

## Current Status

**Complete (course "done" criteria met):** Projects 1, 2, 4, 5, 12.

**Local rehearsal / simulation complete — one live step pending:** Projects 3, 6, 7, 8, 10, 11.
Each has a working local version of the same loop; the pending step needs a Claude Max plan
(Routines), a live GitHub repository, or a Slack workspace.

**Pending (no offline analogue):** Project 9 — the one-off-quota mechanic only exists inside Routines.

### Remaining live work

| Project | Remaining step |
|---|---|
| 6 | Put the doorbell files in a GitHub repo; `claude setup-token`; add the repo secret `CLAUDE_CODE_OAUTH_TOKEN`; keep `permissions: pull-requests: write`; open a bug PR and confirm a review lands within ~60s |
| 7 | The "break the connector permission" experiment, on the live doorbell |
| 3, 8, 11 | Create the Routine(s), grant one repo, attach one Slack channel, run for the stated number of days |
| 9 | Fire three one-off `/schedule` runs, then enable the recurring schedule |
| 10 | Add the secret in the Routine UI's "Secrets and Environment" panel and confirm masking in the transcript |

Details for each are in `NOTES.md` and the individual project READMEs.

---

## Repository Layout

```
.
├── README.md                     this file
├── NOTES.md                      concepts + per-project status tracker
├── 01-watch-loop/                ISS position watcher  (fetch-iss.js, check.js, spine.json, SUMMARY.md)
├── 02-make-tests-pass/           sample-repo/ with failing auth tests + a tiny linter
├── 03-morning-brief-memory/      fetch-signals / build-brief / check-brief + fixtures + spine.md
├── 04-fix-loop-checker/          bug/ library + spec.md rubric + check.js + run.md + reference-solution.diff
├── 05-codify-the-body/           workflow-brief.md + SUMMARY.md + VERIFIED-by-me.md
├── 06-doorbell-loop/             .github/workflows/doorbell.yml + review-local.js + checklist + diffs
├── 07-break-it-on-purpose/       loop-demo/ (flag-driven breaks) + experiments.md
├── 08-your-own-daily-loop/       rehearsal/ (rules.json, triage.js, check-triage.js, 5-day fixtures)
├── 09-rehearse-routine-free/     routine-prompt.md + decision.md
├── 10-secrets-drill/             drill/ (use-secret.js, leak-hunt.js, bad-example.js)
├── 11-two-routine-gate/          gate-sim/ (maker-routine.js, checker-routine.js, shared-skill.md, progress.md)
└── 12-dreaming-loop/             scan.js + replay.js + skill-history/day-1..7.md + metrics.md
```

Most folders carry generated artefacts (`briefs/`, `outbox/`, `prs/`) so a reviewer can see a
completed run without executing anything; a `reset.js` restores the starting state.

> **Repository hygiene:** `04-fix-loop-checker/bug/` and `10-secrets-drill/drill/` originally had
> their own nested `.git` directories (from the worktree and secret-history exercises). Those have
> been removed — both are now plain subfolders of this repository, with no loss of working files.
> Project 4's reference fix was preserved as `04-fix-loop-checker/reference-solution.diff`, and its
> `README.md` documents the worktree / reset workflow against this repo's root.

---

## Running the Projects

Requirements: **Node.js 18+** (built and tested on v24), and Claude Code for the projects that use
`/loop`, `/goal`, or the Workflow tool.

Each folder's `README.md` has the exact commands. Quick examples:

```bash
# Project 1 — in-session watcher
cd 01-watch-loop && node fetch-iss.js

# Project 2 — the failing tests the /goal loop must fix
cd 02-make-tests-pass/sample-repo && npm test && npm run lint

# Project 4 — the buggy library the maker/checker loop repairs
cd 04-fix-loop-checker/bug && npm test

# Project 12 — replay the 7-day dreaming-loop arc
cd 12-dreaming-loop && node reset.js && node replay.js
```

---

## Author

**Aimzaa** — [github.com/Aimzaa](https://github.com/Aimzaa) · pakmonsters@gmail.com

Built as a full working pass through the Loop Engineering crash course. Structure and section
inspiration from the reference repo
[`NaveedTechLab/Loop-Engineering-Projects`](https://github.com/NaveedTechLab/Loop-Engineering-Projects);
all code, runs, and verification records here are original to this project.
