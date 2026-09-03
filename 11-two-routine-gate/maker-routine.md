# Maker Routine — setup

**Schedule:** `every weekday at 9:00am`
**Access:** sirf `<OWNER/REPO>`, write to branch `claude/morning-triage` + open PR.

**Prompt:**
> Read `shared-skill.md`. Act as the MAKER only. Find today's `<label:triage>` issues in
> `<OWNER/REPO>` that fall inside the "safe fix" scope. Make the smallest correct patch for up to
> 3 of them, open one PR against the `claude/morning-triage` branch, and write today's block to
> `progress.md` exactly in the format the skill specifies (Checker verdict: pending).
> Do NOT review or merge. Obey all stopping conditions.

**Rehearse pehle (Project 9):** `/schedule in 2 minutes, run this` — 3 saaf runs, phir recurring.
