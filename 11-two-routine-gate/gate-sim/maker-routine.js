"use strict";
/*
 * MAKER routine (the "9:00am" job). Separate process from the checker.
 * Reads a task, makes the smallest patch to main/config.js, opens a "PR" under prs/,
 * and writes today's block to progress.md (the spine). It never grades or merges.
 *
 * Usage: node maker-routine.js --task inbox/day1.json [--date YYYY-MM-DD]
 */

const fs = require("fs");
const path = require("path");

const HERE = __dirname;
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const DATE = opt("--date", new Date().toISOString().slice(0, 10));
const taskPath = opt("--task", null);
if (!taskPath) { console.error("need --task <file>"); process.exit(1); }

fs.readFileSync(path.join(HERE, "shared-skill.md"), "utf8"); // both routines read the one skill
const task = JSON.parse(fs.readFileSync(path.join(HERE, taskPath), "utf8"));

const PROGRESS = path.join(HERE, "progress.md");
const spine = fs.existsSync(PROGRESS) ? fs.readFileSync(PROGRESS, "utf8") : "";
if (new RegExp(`^## ${DATE}\\b`, "m").test(spine)) {
  console.log(`SKIP: progress.md already has a block for ${DATE} (idempotent guard).`);
  process.exit(0);
}

const base = fs.readFileSync(path.join(HERE, "main", "config.js"), "utf8");
const baseLines = base.split("\n");
let out = baseLines.slice();
const changed = [];

if (task.op === "set-number") {
  const re = new RegExp(`^(\\s*const ${task.key}\\s*=\\s*)(\\d+)(.*)$`);
  const idx = out.findIndex((l) => re.test(l));
  if (idx < 0) { console.error(`maker: ${task.key} not found`); process.exit(1); }
  out[idx] = out[idx].replace(re, `$1${task.value}$3`);
  changed.push(idx + 1);
} else if (task.op === "add-param") {
  const re = new RegExp(`^(\\s*function ${task.fn}\\()([^)]*)(\\).*)$`);
  const idx = out.findIndex((l) => re.test(l));
  if (idx < 0) { console.error(`maker: function ${task.fn} not found`); process.exit(1); }
  out[idx] = out[idx].replace(re, (_, a, params, c) => `${a}${params ? params + ", " : ""}${task.param}${c}`);
  changed.push(idx + 1);
} else {
  console.error(`maker: unknown op ${task.op}`); process.exit(1);
}

// count existing PRs -> next number
const prsDir = path.join(HERE, "prs");
fs.mkdirSync(prsDir, { recursive: true });
const n = fs.readdirSync(prsDir).filter((d) => d.startsWith("pr-")).length + 1;
const prDir = path.join(prsDir, `pr-${n}`);
fs.mkdirSync(prDir, { recursive: true });
fs.writeFileSync(path.join(prDir, "config.js"), out.join("\n"));
fs.writeFileSync(
  path.join(prDir, "meta.json"),
  JSON.stringify({ pr: `pr-${n}`, date: DATE, issue: task.issue, what: task.what, op: task.op, changed_lines: changed, base_file: "main/config.js" }, null, 2)
);

const block =
`## ${DATE}
- PR: pr-${n}
- Task: ${task.issue} ${task.what}
- Maker done: ${DATE}T09:00
- Checker verdict: (pending)
`;
fs.appendFileSync(PROGRESS, "\n" + block);

console.log(`MAKER ${DATE}: opened pr-${n}  (${task.issue}, op=${task.op}, changed line(s) ${changed.join(",")})`);
console.log(`wrote prs/pr-${n}/config.js + meta.json, appended progress.md (verdict pending)`);
