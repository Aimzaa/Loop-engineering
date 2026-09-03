# Checker Rubric — Project 4

Checker agent isko use karke `PASS` / `FAIL` decide karta hai. Maker isko na parhe to behtar
(taake wo test ke bajaye asal fix kare) — par transparency ke liye yahan hai.

## PASS ke liye SAB zaroori:
1. `npm test` (bug/ ke andar) — saare tests green, 0 failing.
2. `bug/test/` ki koi file change nahi hui (git diff se tasdeeq). Tests ko fit karne ke liye tweak karna = FAIL.
3. Fix `bug/src/paginate.js` mein hai, logic-level (off-by-one theek hua), koi hard-coded
   `if (page === 2) return [4,5,6]` type cheating nahi.
4. `paginate` ab bhi 1-indexed hai (page 1 = pehla slice), signature same.
5. Koi naya runtime dependency add nahi hua.

## FAIL par
Pehli line: `FAIL`
Phir bullets: kaunsi condition tooti, kahan (`file:line`), maker ke liye ek concrete hint.

## PASS par
Pehli line: `PASS`
Phir 1-2 bullet: kya change hua aur kyun theek hai.
