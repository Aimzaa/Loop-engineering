"use strict";
// Tiny stand-in linter for Project 2. Zero dependencies.
// Rules: no console.* in src/, no `var`, no trailing whitespace, no tabs.
// Exit 0 = clean, exit 1 = problems (and prints them).

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src");
const problems = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith(".js")) lintFile(p);
  }
}

function lintFile(file) {
  const rel = path.relative(path.join(__dirname, ".."), file);
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const n = i + 1;
    const code = line.replace(/\/\/.*$/, "");
    if (/\bconsole\.\w+\s*\(/.test(code)) problems.push(`${rel}:${n}  no-console`);
    if (/\bvar\s+[A-Za-z_$]/.test(code)) problems.push(`${rel}:${n}  no-var`);
    if (/[ \t]+$/.test(line)) problems.push(`${rel}:${n}  trailing-whitespace`);
    if (/\t/.test(line)) problems.push(`${rel}:${n}  no-tabs`);
  });
}

walk(SRC);

if (problems.length === 0) {
  console.log("lint: clean");
  process.exit(0);
}
console.log("lint: " + problems.length + " problem(s)");
for (const p of problems) console.log("  " + p);
process.exit(1);
