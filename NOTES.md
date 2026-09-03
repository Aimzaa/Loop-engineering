# Loop Engineering — Meri Notes + Project Tracker

Source: https://agentfactory.panaversity.org/docs/loop-engineering-crash-course
Labs repo: https://github.com/panaversity/agentfactory-labs/tree/main/crash-course/loop-eng

---

## 1. Loop Engineering kya hai? (Mindset shift)

Pehle: har turn pe tum khud prompt likhte ho -> AI jawab deta hai -> tum agla prompt likhte ho.
Ab: tum aisa **system** design karte ho jo khud ko prompt karta hai, baar baar, bina tumhare.

Tumhare paas 2 cheezein rehti hain:
- **Intent** — "done" ka matlab clearly define karna (kab kaam khatam?)
- **Accountability** — result ka zimma tumhara hai (AI ka nahi)

Baaki sab (kab chale, kaise chale, kaha chale) tum ek dafa design karte ho.

---

## 2. Six-Part Loop (har loop mein ye 6 cheezein hoti hain)

| # | Part | Kaam |
|---|------|------|
| 1 | **Heartbeat** | Har run ko kya start karta hai (timer / schedule / event / condition) |
| 2 | **Worktree** | Alag isolated checkout taake parallel agents aapas mein na takrayein |
| 3 | **Skill** | Project ka knowledge ek dafa `SKILL.md` mein likha hua |
| 4 | **Subagents** | Alag "maker" aur "checker" — apna kaam khud approve nahi karte |
| 5 | **Connector / MCP** | Bahar ke tools tak pahunch (GitHub, Slack, DB) |
| 6 | **Spine** | State file jo runs ke beech memory yaad rakhti hai |

---

## 3. Four Heartbeats (run kaise start hota hai)

| Heartbeat | Kab chalta hai | Laptop band ho sakta? | Best for |
|-----------|----------------|----------------------|----------|
| **In-session** `/loop` | Session khula ho tab timer pe | Nahi | Deployment dekhna, live monitoring |
| **Conditional** `/goal` | Jab checked condition true ho | Nahi | "tests pass hone tak chalao" |
| **Scheduled** `/schedule` (cron/Routine) | Clock time pe (daily/weekly) | Haan | Repeating kaam: triage, reports |
| **Event-driven** (GitHub/API) | Jab kuch hota hai (PR khula, msg aaya) | Haan | PR/alert pe react karna |

---

## 4. Sabse ZAROORI rule: Stopping Condition

> "The loop is only as good as its stopping condition."

Har unattended loop mein **3 stops** hone chahiye:
1. **Success condition** — kaam ho gaya, ruk jao
2. **Retry limit** — X dafa fail hua to ruk jao
3. **Stuck detection** — koi progress nahi ho rahi to ruk jao

Ye na ho to loop paisa/time jala dega ya galat kaam repeat karega.

---

## 5. Maker–Checker Principle

Jo agent code likhta hai wo apna kaam **kabhi khud approve nahi karta**.
Doosra agent ya command (test runner, linter) result ko grade karta hai.

---

## 6. Projects Roadmap (course ki asli 12-project sequence)

| # | Project | Heartbeat | Folder | Locally buildable? | Status |
|---|---------|-----------|--------|--------------------|--------|
| 1 | Watch loop (ISS har minute) | In-session `/loop` | `01-watch-loop/` | Haan | [x] DONE — 10 beats, success stop, SUMMARY.md |
| 2 | Make the test pass, then stop | Conditional `/goal` | `02-make-tests-pass/` | Haan | [x] DONE — 6/6 tests pass, lint clean, only src/auth.js touched |
| 3 | The morning brief with a memory | Scheduled (Routine) | `03-morning-brief-memory/` | Local version DONE; real Routine = Max plan | [x] DONE — 2-day rehearsal, memory (NEW/FIXED) works, checker PASS |
| 4 | A fix loop with a real checker | Conditional + maker/checker + `--worktree` | `04-fix-loop-checker/` | Haan | [x] DONE — worktree fix, separate check.js PASS, merged; bug/ reset to baseline |
| 5 | Codify the body (dynamic workflow) | Conditional (workflow ke andar) | `05-codify-the-body/` | Haan (`ultracode`/workflow) | [x] DONE — 2 runs (wf_9e4a45e1: 13ag 10/6/4; wf_d4043ab4: 11ag 8/5/3), user-verified from journal, SUMMARY.md + VERIFIED-by-me.md |
| 6 | The doorbell loop (PR review) | Event-driven (GitHub Action) | `06-doorbell-loop/` | Haan (GitHub repo chahiye) | [~] LOCAL REHEARSAL DONE (dono branches: sample.diff 4 blockers/exit 1, clean.diff exit 0; VERIFIED-by-me.md). LIVE GitHub event-driven setup PENDING — dedicated repo banne ke baad (steps 06-doorbell-loop/README.md + neeche "Pending" section) |
| 7 | Break it on purpose | Conditional | `07-break-it-on-purpose/` | Haan (Project 6 pe) | [~] 4/5 breaks DONE on loop-demo/ (stopcond=RUNAWAY, skill=stuck, checker=silent-wrong-exit0, spine=memory-loss; all restored+verified). Break #4 connector = live GitHub (PENDING). experiments.md filled |
| 8 | Your own daily loop | Scheduled (Routine, weekday 9am) | `08-your-own-daily-loop/` | Local rehearsal DONE; real Routine = Max plan | [~] LOCAL REHEARSAL DONE — rehearsal/ 5-day arc (P0/P1/P2 rules, spine memory carries FIXED/NEW/CARRIED), checker PASS all 5 days, run-log.md filled. Live weekday-9am Routine + real repo + Slack = PENDING |
| 9 | Rehearse a routine for free | Scheduled (one-off) | `09-rehearse-routine-free/` | PURE Routines mechanic — no local version | [~] PENDING (Max plan). routine-prompt.md + decision.md + three-run-validation steps ready; run when Routines access hai |
| 10 | The secrets drill | Scheduled (koi bhi recurring Routine) | `10-secrets-drill/` | Local drill DONE; Routine UI Secrets panel = Max plan | [~] LOCAL DRILL DONE — drill/: env-ref (no-env=FAIL), connector call OK + masked (output+disk), leak-hunt caught bad-example -> removed -> CLEAN (tree+git history), rotate w/ no code change. Steps 1-2 (Routine UI panel) PENDING |
| 11 | Build the two-routine gate | Scheduled (2 Routines, 30 min gap) | `11-two-routine-gate/` | Local sim DONE; 2 cloud Routines = Max plan | [~] LOCAL SIM DONE — gate-sim/: 2 separate processes talking only via progress.md; day1 safe change -> checker PASS+merge, day2 signature change -> checker FAIL+comment+PR open. Live 2-Routine (9:00/9:30) = PENDING |
| 12 | Build a dreaming loop | Scheduled (nightly) + roz insaan skill update kare | `12-dreaming-loop/` | Haan (skill self-improve pattern) | [x] DONE — scan.js reads SKILL.md patterns; 7-day arc caught 3/9 -> 9/9; loop never self-edits, human adds each missed pattern; metrics.md + progress.md |

**Padhne ka order (course):**
- First read: Parts 1-5 + Projects 1-3 (~2 ghante) — safe, watchable loops.
- Second read: Part 6 + Projects 4-12 + Routines appendix — production unattended systems.

---

## PENDING (baad mein — jab dedicated GitHub repo ban jaye + Claude Max/Routines)

Plan: pehle saare 12 projects local complete, phir ek naya dedicated GitHub repo (`Aimzaa/<name>`) bana kar sab upload.

| Project | Kya pending | Kab ho sakta |
|---------|-------------|--------------|
| 6 — doorbell | LIVE GitHub event-driven: repo mein `.github/workflows/doorbell.yml` + `SKILL.md` + `review-checklist.md`; `claude setup-token` -> repo secret `CLAUDE_CODE_OAUTH_TOKEN`; `permissions: pull-requests: write` (green-check gotcha); bug wali PR kholo -> ~60s mein review comment = course "Done" | dedicated repo banne par |
| 7 — break it | 1 break ("connector permission") ke liye live doorbell chahiye; baaki 4 breaks local par ho jate hain | P6 live ke saath |
| 3, 8, 9, 10, 11 | Asli Claude **Routines** (Max plan) + Slack connector + asli repo. Local versions / skills + exact steps ready hain. | Max plan par |

**Note:** Projects 3, 8, 9, 10, 11 ke liye Claude **Routines** (Max plan) + Slack connector + asli repo chahiye.
Un mein main `SKILL.md` + exact steps bana deta hoon; asli schedule tum apne account se lagaoge.
Har folder ke `README.md` mein us project ka goal / heartbeat / "done" / steps course se likhe hain.

---

## Prerequisites (agar gap lage to ye padho)
- Agentic Coding Crash Course: /docs/agentic-coding-crash-course (plan mode, context, skills, subagents, MCP)
- Spec-Driven Development: /docs/spec-driven-development-crash-course (testable conditions likhna)
