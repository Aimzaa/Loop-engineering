# Project 4 — A Fix Loop with a Real Checker (Conditional + Maker–Checker + `--worktree`)

**Course goal:** Ek fix isolation mein implement karo jabke ek ALAG agent us kaam ko grade kare.
**Heartbeat:** Conditional
**"Done" ka matlab:** Maker ka code checker ke rubric ko pass kare. Alag agents self-approval rokte hain.

## Course ka pattern
- Ek agent `--worktree` checkout mein fix likhta hai (isolated — asli files ko haath nahi lagता).
- Ek doosra agent `spec.md` + tests ke against review karta hai.
- Checker `PASS` ya `FAIL` + reasons deta hai.
- Loop sirf `PASS` par rukta hai.

---

## Is folder mein
| File | Kya |
|------|-----|
| `bug/` | `paginate` lib mein 2 asli bugs, 4 failing tests. **`bug/` ab is `loop-engineering` repo ka normal subfolder hai** (pehle iska apna nested git repo tha — hygiene ke liye hata diya). |
| `bug/src/paginate.js` | committed state = **buggy baseline** (yehi wo cheez hai jo loop theek karta hai) |
| `reference-solution.diff` | reference fix (patch form). Exercise se pehle mat dekho. Apply karne ka tareeqa neeche "Reference solution" mein. |
| `spec.md` | checker ka rubric — `PASS` kya kehlata hai |
| `check.js` | **checker** — ALAG process; khud tests re-run karta hai, `git diff main HEAD` dekhta hai, `spec.md` enforce karta hai |
| `run.md` | Claude Code ke 2 alag sessions se karne ke exact prompts (paths is folder ke relative hain) |

Do bugs: `paginate()` `page * perPage` (chahiye `(page-1)*perPage`) · `pageCount()` `Math.floor` (chahiye `Math.ceil`).

---

## Pehle: root repo ready karo (ek dafa)

`check.js` `git diff main HEAD` use karta hai, aur `git worktree` ke liye commit chahiye. Isliye root
`loop-engineering` repo mein **`main` branch + kam se kam ek commit** hona zaroori hai:

```powershell
cd "E:\loop engineering project"          # <- repo root (jahan NOTES.md hai)

git branch -m master main                 # default branch ka naam 'main' karo (agar 'master' hai)
git add -A
git commit -m "loop engineering: 12 projects"
git tag p4-baseline                       # Project 4 ko reset karne ke liye clean anchor
```

> `check.js` branch ka naam **`main`** expect karta hai. Agar tumhara default `master` rakhna hai to
> `check.js` mein `"main"` ko `"master"` karna padega — warna `main` hi rakho (recommended).

---

## Running the loop (root `loop-engineering` repo se)

```powershell
cd "E:\loop engineering project"

# 1. MAKER: isolated worktree (yehi loop ka "--worktree" part) — poore repo ka alag checkout
git worktree add -b fix/paginate ..\le-p4-fix main

# 2. MAKER: sirf ..\le-p4-fix\04-fix-loop-checker\bug\src\paginate.js theek karo
#    (bug\test\ ko haath mat lagao), phir usi worktree mein commit karo:
cd ..\le-p4-fix\04-fix-loop-checker\bug
node --test "test/**/*.test.js"                          # sab green hone chahiye
cd ..\..                                                 # -> ..\le-p4-fix
git add -A
git -c user.email=lab@local -c user.name=lab commit -m "fix(paginate)"

# 3. CHECKER (alag process — maker ka context nahi): spec.md enforce karta hai
cd "E:\loop engineering project\04-fix-loop-checker"
node check.js "..\..\le-p4-fix\04-fix-loop-checker"      # line 1: PASS ya FAIL
#   (check.js khud us path ke andar 'bug' folder dhoondh leta hai)

# 4a. FAIL -> checker ke reasons maker ko do, step 2 dobara (same worktree)
# 4b. PASS -> merge + cleanup (root se):
cd "E:\loop engineering project"
git merge --ff-only fix/paginate                         # bug/src/paginate.js ab main par bhi fixed
node --test "04-fix-loop-checker/bug/test/**/*.test.js"  # green
git worktree remove ..\le-p4-fix
git branch -d fix/paginate
```

Claude Code ke andar 2 sessions se karna ho: `run.md` ke prompts use karo (maker session + alag
checker session). `run.md` mein jo relative paths hain woh is `04-fix-loop-checker/` folder ke liye hain.

---

## Reset (dobara run karne ke liye)

Exercise ke baad `bug/src/paginate.js` ko buggy baseline par wapas laao:

```powershell
cd "E:\loop engineering project"

# agar worktree/branch bache hon:
git worktree remove ..\le-p4-fix 2>$null
git branch -D fix/paginate 2>$null

# buggy baseline restore (sirf yeh ek file):
git checkout p4-baseline -- 04-fix-loop-checker/bug/src/paginate.js

# agar step 4b ka merge ho chuka tha to us commit ko bhi undo karo:
#   git log --oneline    # "fix(paginate)" commit dhoondo
#   git revert <hash>     # ya: git reset --hard p4-baseline  (poora repo baseline par — dhyan se)
```

`p4-baseline` tag na ho to: `git show HEAD:04-fix-loop-checker/bug/src/paginate.js` se pehli committed
state dekh kar `src/paginate.js` manually restore karo (do lines — "Reference solution" section dekho).

---

## Reference solution (preserve kiya hua)

`reference-solution.diff` mein wahi 2-line fix hai (`bug/src/paginate.js` ke liye):

| line | buggy (baseline) | fixed |
|------|------------------|-------|
| `paginate()` | `const start = page * perPage;` | `const start = (page - 1) * perPage;` |
| `pageCount()` | `return Math.floor(count / perPage);` | `return Math.ceil(count / perPage);` |

**Sabse sahi tareeqa — `bug/src/paginate.js` mein woh 2 lines khud edit karo** (upar wali table).
Koi side-effect nahi. Phir:

```powershell
cd "E:\loop engineering project\04-fix-loop-checker\bug"
node --test "test/**/*.test.js"              # 5/5 pass
```

**Patch se (optional):** `patch -p1 < ..\reference-solution.diff` bhi kaam karta hai, magar Windows par
`patch` file ki line-endings CRLF -> LF kar deta hai (content sahi, bytes badal jaate hain). `git apply`
CRLF files par aksar "Skipped" deta hai. Isliye exact-byte baseline chahiye to manual edit hi karo, ya
`git checkout p4-baseline -- ...` (Reset section).

---

## Hum ne kya dekha (verified)
- Maker ne alag worktree mein fix kiya → wahan 5/5 pass, jabke asli `bug/` abhi bhi 4 fail (isolation).
- `check.js` (alag process) ne khud tests re-run kiye + `git diff main HEAD` se confirm kiya `test/`
  untouched, fix expression-level hai, `paginate` abhi bhi 1-indexed hai, koi dependency add nahi →
  **PASS** (5/5 rubric items).
- PASS par hi merge hua. Maker ne khud "done" nahi kaha — checker ne kaha.

## Kya sikhaya
- **Worktree** = parallel/isolated kaam, asli tree safe.
- **Maker ≠ Checker** — checker ko maker ke dawe nazar nahi aate, sirf code + tests + `git diff`.
- **"Done" = checker ka PASS**, retry limit = 5 maker rounds (`run.md`).
