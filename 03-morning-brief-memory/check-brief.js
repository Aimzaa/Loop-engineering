"use strict";
// The CHECKER half - a SEPARATE process. Run after build-brief.js.
// Verifies the brief and the spine before the loop is allowed to call the run a success.
//
// Usage: node check-brief.js [--date YYYY-MM-DD]
// Exit 0 = run accepted, exit 1 = roll back / do not post.

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const di = args.indexOf("--date");
const DATE = di >= 0 && args[di + 1] ? args[di + 1] : new Date().toISOString().slice(0, 10);

const briefPath = path.join(__dirname, "briefs", `${DATE}.md`);
const spinePath = path.join(__dirname, "spine.md");
const outboxPath = path.join(__dirname, "outbox", `${DATE}.txt`);

const checks = [];
const add = (name, pass) => checks.push([name, !!pass]);

add("brief file exists", fs.existsSync(briefPath));
const brief = fs.existsSync(briefPath) ? fs.readFileSync(briefPath, "utf8") : "";

add("has NEW / FIXED / STILL OPEN sections", /## NEW/.test(brief) && /## FIXED/.test(brief) && /## STILL OPEN/.test(brief));
add("has a 'Biggest risk today' line", /## Biggest risk today/.test(brief));
// Only flag ALL-CAPS template placeholders like <REPO> / <CHANNEL>; real issue
// titles legitimately contain things like "--view <number>".
add("no leftover <PLACEHOLDER> tokens", !/<[A-Z][A-Z_]{2,}>/.test(brief));
add("brief is for the right date", new RegExp(`Morning Brief - ${DATE}`).test(brief));

const spine = fs.existsSync(spinePath) ? fs.readFileSync(spinePath, "utf8") : "";
const spineBlocks = spine.split(/^## Run /m).slice(1).map((b) => "## Run " + b);
const lastSpine = spineBlocks[spineBlocks.length - 1] || "";
add("spine's LAST block is today's run", lastSpine.startsWith(`## Run ${DATE}`));
add("spine block has all three memory lines", /- NEW:/.test(lastSpine) && /- FIXED:/.test(lastSpine) && /- STILL OPEN:/.test(lastSpine));
add("exactly one spine block per date (no dup)", spineBlocks.filter((b) => b.startsWith(`## Run ${DATE}`)).length === 1);
add("outbox message was written", fs.existsSync(outboxPath));

let pass = true;
for (const [name, ok] of checks) {
  console.log((ok ? "PASS  " : "FAIL  ") + name);
  if (!ok) pass = false;
}
console.log("\nCHECKER: " + (pass ? "PASS - brief may be posted" : "FAIL - do not post, roll back this run"));
process.exit(pass ? 0 : 1);
