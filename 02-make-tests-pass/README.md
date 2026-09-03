# Project 2 — Make the Test Pass, Then Stop (Conditional Heartbeat)

**Course goal:** Ek testable condition true hone tak loop chale, phir khud-ba-khud ruk jaye.
**Heartbeat:** Conditional (`/goal`)
**"Done" ka matlab:** Tests pass + linter clean + ek alag checker (Haiku by default) confirm kare "Are we done?" = yes.

## Course ke steps
1. Aisi repo mein jao jahan `test/auth` ke tests fail ho rahe hain. (Yahan `sample-repo/` bana diya hai.)
2. Provable condition ke saath `/goal`:
   ```
   /goal All tests in test/auth pass and `npm run lint` is clean.
   ```
3. Agent code edit karta hai, tests chalata hai, failures parhta hai, iterate karta hai.
4. Har turn ke baad ek alag model verify karta hai: "Are we done?"
5. Loop tabhi rukta hai jab condition proven true ho, ya tum `/goal clear` karo.

**Critical rule:** Aisi condition likho jo ek command *prove* kar sake — "tests pass and lint is clean" —
raaye nahi jaise "the auth code is good".

**Token safety:** condition ke andar retry limit daalo:
```
/goal ...condition... or stop after 20 turns
```

## Is folder mein setup
```
cd "E:\loop engineering project\02-make-tests-pass\sample-repo"
npm install       # kuch nahi chahiye, par convention
npm test          # abhi FAIL — test/auth ke 3 tests red hain (yehi expected)
npm run lint      # abhi FAIL — 2 lint errors
```
Phir isi folder mein `claude` khol kar upar wali `/goal` line chalao. Jab `npm test` && `npm run lint`
dono green, loop ruk jayega.

## Kya seekhna hai
- "Done" ek opinion nahi, ek command ka exit code hai.
- Maker (fix likhne wala) aur checker (Are-we-done judge) alag hain.
- Retry limit na ho to loop tokens jala sakta hai.
