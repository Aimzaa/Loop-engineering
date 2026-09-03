# Project 4 — Exact prompts

## 1. Maker (worktree ke andar, isolated)
> Create a git worktree off the current branch. Inside that worktree only, fix the bug(s) in
> `bug/src/paginate.js` so that `npm test` in `bug/` passes all tests. Do NOT modify anything under
> `bug/test/`. When finished, print: the worktree path, `git diff --stat`, and a 2-line summary of
> the root cause and the fix.

## 2. Checker (alag session / alag subagent — maker ka context na ho)
> Read `spec.md` in the project root. A change was made in the worktree at `<PATH-FROM-MAKER>`.
> Independently: `cd` into `<PATH>/bug`, run `npm test`, and run `git diff -- bug/test/` to confirm
> tests were untouched. Judge the change against every numbered item in `spec.md`.
> Reply with `PASS` or `FAIL` on line 1, then bullet-point reasons. Do not fix anything yourself.

## 3. Loop
- Checker = `FAIL` -> maker ko reasons paste karo, step 1 dobara (same worktree).
- Checker = `PASS` -> loop khatam. Worktree ko merge/apply karo, phir hata do.
- Retry limit: 5 maker rounds ke baad bhi FAIL -> ruk jao, khud dekho.
