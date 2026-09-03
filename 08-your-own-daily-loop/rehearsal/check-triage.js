"use strict";
// CHECKER - separate process. Run after triage.js. Exit 0 = post allowed, 1 = roll back.
// Usage: node check-triage.js [--date YYYY-MM-DD]

const fs = require("fs");
const path = require("path");
const HERE = __dirname;
const args = process.argv.slice(2);
const di = args.indexOf("--date");
const DATE = di >= 0 && args[di + 1] ? args[di + 1] : new Date().toISOString().slice(0, 10);

const briefP = path.join(HERE, "briefs", `${DATE}.md`);
const spineP = path.join(HERE, "spine.md");
const outboxP = path.join(HERE, "outbox", `${DATE}.txt`);

const checks = [];
const add = (n, ok) => checks.push([n, !!ok]);

add("brief file exists", fs.existsSync(briefP));
const brief = fs.existsSync(briefP) ? fs.readFileSync(briefP, "utf8") : "";
add("has P0 / P1 / P2 sections", /## P0 \(/.test(brief) && /## P1 \(/.test(brief) && /## P2 \(/.test(brief));
add("has a 'Biggest risk today' line", /## Biggest risk today/.test(brief));
add("brief is for the right date", new RegExp(`Daily Triage - ${DATE}`).test(brief));
add("no <PLACEHOLDER> tokens left", !/<[A-Z][A-Z_]{2,}>/.test(brief));
const p0count = Number((brief.match(/## P0 \((\d+)\)/) || [])[1] || 0);
add("P0 section => @here mention present iff P0>0", p0count > 0 ? /@here/.test(brief) : true);

const spine = fs.existsSync(spineP) ? fs.readFileSync(spineP, "utf8") : "";
const sBlocks = spine.split(/^## Run /m).slice(1).map((b) => "## Run " + b);
const last = sBlocks[sBlocks.length - 1] || "";
add("spine's LAST block is today", last.startsWith(`## Run ${DATE}`));
add("spine block has P0 / FIXED / OPEN lines", /- P0:/.test(last) && /- FIXED since last run:/.test(last) && /- OPEN P0\/P1 carried:/.test(last));
add("exactly one spine block for today (no dup)", sBlocks.filter((b) => b.startsWith(`## Run ${DATE}`)).length === 1);
add("outbox message written", fs.existsSync(outboxP));

let pass = true;
for (const [n, ok] of checks) { console.log((ok ? "PASS  " : "FAIL  ") + n); if (!ok) pass = false; }
console.log("\nCHECKER: " + (pass ? "PASS - brief may be posted" : "FAIL - do not post"));
process.exit(pass ? 0 : 1);
