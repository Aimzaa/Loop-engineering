"use strict";
/*
 * One nightly beat of the dreaming loop.
 * Reads a skill file's pattern list, scans scan-target/payments.js, and records
 * Found / Missed in progress.md. The loop does NOT rewrite the skill -- YOU do,
 * each morning, based on what it Missed.
 *
 * Usage: node scan.js [--skill SKILL.md] [--date YYYY-MM-DD] [--quiet]
 */

const fs = require("fs");
const path = require("path");
const HERE = __dirname;

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const SKILL = opt("--skill", "SKILL.md");
const DATE = opt("--date", new Date().toISOString().slice(0, 10));
const QUIET = args.includes("--quiet");

const groundTruth = JSON.parse(fs.readFileSync(path.join(HERE, "patterns-full.json"), "utf8")).patterns;
const gtIds = groundTruth.map((p) => p.id);

// parse skill pattern lines:  - <id> | <regex> | <name>
const skillText = fs.readFileSync(path.join(HERE, SKILL), "utf8");
const skillPatterns = [];
for (const line of skillText.split("\n")) {
  const m = line.match(/^-\s*([\w-]+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*$/);
  if (!m) continue;
  let re;
  try { re = new RegExp(m[2], "m"); } catch (e) { continue; }
  skillPatterns.push({ id: m[1], re, name: m[3] });
}

const code = fs.readFileSync(path.join(HERE, "scan-target", "payments.js"), "utf8");
const found = skillPatterns.filter((p) => p.re.test(code)).map((p) => p.id);
const caught = gtIds.filter((id) => found.includes(id));
const missed = gtIds.filter((id) => !caught.includes(id));

// append progress.md block
const P = path.join(HERE, "progress.md");
const block =
`\n## Run ${DATE}  (skill: ${SKILL})
- Found: ${caught.length} -> ${caught.join(", ") || "(none)"}
- Missed: ${missed.length} -> ${missed.join(", ") || "(none)"}
- Skill update needed: ${missed.length ? "add pattern for '" + missed[0] + "' (" + (groundTruth.find((g) => g.id === missed[0]) || {}).name + ")" : "none - skill is complete"}
`;
if (!QUIET) fs.appendFileSync(P, block);

console.log(`scan ${DATE} (${SKILL}): caught ${caught.length}/${gtIds.length}  [${caught.join(", ")}]`);
if (missed.length) console.log(`  missed ${missed.length}: ${missed.join(", ")}  -> tomorrow add: ${missed[0]}`);
else console.log("  nothing missed - the skill has learned everything.");
