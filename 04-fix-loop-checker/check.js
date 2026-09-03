"use strict";
// The CHECKER — a SEPARATE process from the maker. It does not trust the maker's
// word; it re-runs the tests itself and grades the change against spec.md.
//
// Usage: node check.js <path-to-worktree>
// Prints PASS or FAIL on line 1, then reasons. Exit 0 = PASS, 1 = FAIL.

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const wt = process.argv[2];
if (!wt || !fs.existsSync(wt)) {
  console.log("FAIL\n- worktree path not given or does not exist");
  process.exit(1);
}
const bug = path.join(wt, "bug") ;
const target = fs.existsSync(bug) ? bug : wt; // worktree may be the bug repo itself

const reasons = [];
let ok = true;
const fail = (m) => { ok = false; reasons.push("- " + m); };
const note = (m) => reasons.push("- " + m);
const git = (args) => execFileSync("git", ["-C", target, ...args], { encoding: "utf8" }).trim();

// spec item 1: all tests pass (run node's test runner directly — no npm/shell needed)
let testOut = "";
let testExit = 0;
try {
  testOut = execFileSync(process.execPath, ["--test", "test/**/*.test.js"], {
    cwd: target,
    encoding: "utf8",
  });
} catch (e) {
  testOut = (e.stdout || "") + (e.stderr || "");
  testExit = e.status || 1;
}
const passM = testOut.match(/pass\s+(\d+)/i);
const failM = testOut.match(/fail\s+(\d+)/i);
if (testExit !== 0) fail("test runner exited non-zero in the worktree");
if (failM && Number(failM[1]) === 0 && passM && Number(passM[1]) > 0) {
  note(`spec 1 OK: ${passM[1]} tests pass, 0 fail`);
} else {
  fail(`spec 1: expected all-pass, saw pass=${passM && passM[1]} fail=${failM && failM[1]}`);
}

// spec item 2: no test files were changed
const changed = git(["diff", "--name-only", "main", "HEAD"]).split("\n").filter(Boolean);
const touchedTests = changed.filter((f) => /(^|\/)test\//.test(f));
if (touchedTests.length) fail(`spec 2: test files were modified: ${touchedTests.join(", ")}`);
else note(`spec 2 OK: no files under test/ changed (changed: ${changed.join(", ") || "none"})`);

// spec item 3: fix is in src/paginate.js and looks logic-level, not hardcoded
const diff = git(["diff", "main", "HEAD", "--", "src/paginate.js"]);
if (!diff) fail("spec 3: no change in src/paginate.js");
if (/if\s*\(\s*page\s*===?\s*\d/.test(diff) || /return\s*\[\s*\d+\s*,/.test(diff)) {
  fail("spec 3: change looks like hardcoding expected outputs, not a real fix");
} else if (diff) {
  note("spec 3 OK: change is an expression-level fix in src/paginate.js");
}

// spec item 4: paginate still 1-indexed (page 1 -> first slice)
try {
  const { paginate } = require(path.join(target, "src", "paginate.js"));
  const first = JSON.stringify(paginate([1,2,3,4,5,6], 1, 2));
  if (first === "[1,2]") note("spec 4 OK: paginate is still 1-indexed (page 1 -> [1,2])");
  else fail(`spec 4: page 1 returned ${first}, expected [1,2] (1-indexed)`);
} catch (e) { fail("spec 4: could not load paginate.js: " + e.message); }

// spec item 5: no new runtime dependency
const pkg = JSON.parse(fs.readFileSync(path.join(target, "package.json"), "utf8"));
if (pkg.dependencies && Object.keys(pkg.dependencies).length) fail("spec 5: runtime dependencies were added");
else note("spec 5 OK: no dependencies added");

console.log((ok ? "PASS" : "FAIL") + "\n" + reasons.join("\n"));
process.exit(ok ? 0 : 1);
