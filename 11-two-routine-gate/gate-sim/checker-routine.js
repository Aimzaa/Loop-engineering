"use strict";
/*
 * CHECKER routine (the "9:30am" job). A SEPARATE process from the maker, with no
 * shared memory: it learns which PR to look at ONLY by reading progress.md (the spine).
 * It grades the PR against shared-skill.md, then merges (PASS) or comments (FAIL).
 *
 * Usage: node checker-routine.js [--date YYYY-MM-DD]
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const args = process.argv.slice(2);
const di = args.indexOf("--date");
const DATE = di >= 0 && args[di + 1] ? args[di + 1] : new Date().toISOString().slice(0, 10);

fs.readFileSync(path.join(HERE, "shared-skill.md"), "utf8"); // same skill as the maker

// ---- read the spine to find today's PR (the ONLY channel between the two routines) ----
const PROGRESS = path.join(HERE, "progress.md");
const spine = fs.readFileSync(PROGRESS, "utf8");
const block = spine.split(/(?=^## )/m).find((p) => p.startsWith(`## ${DATE}`));
if (!block) { console.error(`checker: no progress.md block for ${DATE}`); process.exit(1); }
const prId = (block.match(/^- PR:\s*(pr-\d+)/m) || [])[1];
if (!prId) { console.error("checker: no PR id in today's block"); process.exit(1); }
if (/Checker verdict:\s*(PASS|FAIL)/.test(block)) {
  console.log(`SKIP: ${prId} already has a verdict for ${DATE}.`);
  process.exit(0);
}

const prDir = path.join(HERE, "prs", prId);
const meta = JSON.parse(fs.readFileSync(path.join(prDir, "meta.json"), "utf8"));
const prCode = fs.readFileSync(path.join(prDir, "config.js"), "utf8");
const baseCode = fs.readFileSync(path.join(HERE, "main", "config.js"), "utf8");

const reasons = [];
const bl = baseCode.split("\n");
const pl = prCode.split("\n");

// rubric 1: only config.js
if (meta.base_file !== "main/config.js") reasons.push("PR touches a file other than config.js");

// rubric 2 + 3: bounded, in-scope diff
let changedCount = Math.abs(bl.length - pl.length);
for (let i = 0; i < Math.max(bl.length, pl.length); i++) {
  const a = bl[i] ?? "", b = pl[i] ?? "";
  if (a === b) continue;
  changedCount++;
  if (/function |module\.exports/.test(a) || /function |module\.exports/.test(b)) {
    reasons.push(`line ${i + 1}: changes a function signature / module.exports (out of scope)`);
  } else if (/^\s*\/\//.test(b) && /^\s*\/\//.test(a)) {
    // comment change - allowed
  } else if (a.replace(/\d/g, "") === b.replace(/\d/g, "")) {
    // only digits changed - allowed
  } else {
    reasons.push(`line ${i + 1}: non-numeric code change outside scope`);
  }
}
if (changedCount > 6) reasons.push(`diff too large: ${changedCount} changed lines (max 6)`);

// rubric 4: tests pass on the PR version
let testsOk = false;
try {
  const tmp = path.join(prDir, "config.underTest.js");
  fs.copyFileSync(path.join(prDir, "config.js"), tmp);
  // run the real test file but against the PR's config via a shim
  fs.writeFileSync(path.join(prDir, "_run.test.js"),
    `const test=require("node:test");const assert=require("node:assert/strict");const cfg=require("./config.js");\n` +
    fs.readFileSync(path.join(HERE, "main", "config.test.js"), "utf8").split("\n").slice(4).join("\n"));
  execFileSync(process.execPath, ["--test", path.join(prDir, "_run.test.js")], { encoding: "utf8" });
  testsOk = true;
} catch (e) {
  reasons.push("node --test failed on the PR version");
}

// rubric 5: issue reference
if (!meta.issue) reasons.push("no issue reference in meta.json");

const pass = reasons.length === 0;
let newBlock;
if (pass) {
  fs.copyFileSync(path.join(prDir, "config.js"), path.join(HERE, "main", "config.js")); // "merge"
  newBlock = block.replace(/- Checker verdict:.*/, `- Checker verdict: PASS (merged) [${DATE}T09:30]`);
  console.log(`CHECKER ${DATE}: ${prId} PASS -> merged into main/config.js`);
} else {
  fs.writeFileSync(path.join(prDir, "COMMENT.md"),
    `# Checker comment on ${prId} (${DATE})\n\nChanges requested:\n` + reasons.map((r) => `- ${r}`).join("\n") + `\n\n_left open for a human._\n`);
  newBlock = block.replace(/- Checker verdict:.*/, `- Checker verdict: FAIL - ${reasons[0]} [${DATE}T09:30]`);
  console.log(`CHECKER ${DATE}: ${prId} FAIL -> PR left open, COMMENT.md written`);
  for (const r of reasons) console.log(`   - ${r}`);
}
fs.writeFileSync(PROGRESS, spine.replace(block, newBlock));
process.exit(0);
