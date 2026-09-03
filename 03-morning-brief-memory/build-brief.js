"use strict";
// The MAKER half of the morning-brief loop.
//   1. read spine.md  -> remember last run's "STILL OPEN" items (this is the memory)
//   2. read signals    -> today's issues + CI failures (from stdin, or it runs fetch-signals.js)
//   3. diff             -> NEW / FIXED / STILL OPEN
//   4. write briefs/<date>.md, append a block to spine.md, write outbox/<date>.txt (Slack stand-in)
//
// Usage:
//   node fetch-signals.js | node build-brief.js [--date YYYY-MM-DD]
//   node build-brief.js --date 2026-09-02 --fixture fixtures/day2.json
// Idempotent: if spine.md already has a block for <date>, it exits without changes.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};

const DATE = opt("--date", new Date().toISOString().slice(0, 10));
const SPINE = path.join(__dirname, "spine.md");
const BRIEF_DIR = path.join(__dirname, "briefs");
const OUTBOX = path.join(__dirname, "outbox");
for (const d of [BRIEF_DIR, OUTBOX]) fs.mkdirSync(d, { recursive: true });

// --- 1. memory: previous STILL OPEN --------------------------------------------
const spineText = fs.existsSync(SPINE) ? fs.readFileSync(SPINE, "utf8") : "";
if (new RegExp(`^## Run ${DATE}\\b`, "m").test(spineText)) {
  console.log(`SKIP: spine.md already has a block for ${DATE} (idempotent guard).`);
  process.exit(0);
}
const blocks = spineText.split(/^## Run /m).slice(1);
const lastBlock = blocks.length ? blocks[blocks.length - 1] : "";
const prevOpen = parseList(lastBlock, "STILL OPEN");

// --- 2. signals --------------------------------------------------------------
// Priority: (a) explicit --fixture file  (b) piped stdin  (c) run fetch-signals.js.
// Never read stdin when it is a console (TTY) - that hangs / returns oddly on PowerShell.
const fixture = opt("--fixture", null);
let signalsJson = "";
let signalsSource = "";

if (fixture) {
  const candidates = [path.resolve(process.cwd(), fixture), path.join(__dirname, fixture)];
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) {
    console.error(`ERROR: --fixture file not found. Looked in:\n  ${candidates.join("\n  ")}`);
    process.exit(1);
  }
  signalsJson = fs.readFileSync(found, "utf8");
  signalsSource = `fixture ${found}`;
} else if (!process.stdin.isTTY) {
  try {
    signalsJson = fs.readFileSync(0, "utf8");
  } catch (_) {}
  signalsSource = "stdin (piped)";
}

if (!signalsJson.trim()) {
  signalsJson = execFileSync(process.execPath, [path.join(__dirname, "fetch-signals.js")], {
    encoding: "utf8",
  });
  signalsSource = "fetch-signals.js (live)";
}

let signals;
try {
  signals = JSON.parse(signalsJson);
} catch (e) {
  console.error(`ERROR: signals from ${signalsSource} were not valid JSON: ${e.message}`);
  process.exit(1);
}
console.log(`signals: ${signalsSource}`);
const current = [
  ...signals.issues.map((i) => ({ key: i.key, label: `${i.key} ${i.title}`, url: i.url })),
  ...signals.ci_failures.map((c) => ({ key: c.key, label: c.key, url: c.url })),
];
const currentKeys = new Set(current.map((c) => c.key));

// --- 3. diff against memory -------------------------------------------------
const isNew = current.filter((c) => !prevOpen.includes(c.key));
const stillOpen = current.filter((c) => prevOpen.includes(c.key));
const fixed = prevOpen.filter((k) => !currentKeys.has(k));

// --- 4a. brief ------------------------------------------------------------------
const line = (arr, render) => (arr.length ? arr.map(render).join("\n") : "- (none)");
const brief =
`# Morning Brief - ${DATE}
_repo: ${signals.repo} - window: ${signals.window_hours}h - generated: ${signals.generated_at}_

## NEW
${line(isNew, (c) => `- ${c.label}`)}

## FIXED
${line(fixed, (k) => `- ${k}`)}

## STILL OPEN
${line(stillOpen, (c) => `- ${c.label}`)}

## Biggest risk today
${riskLine(isNew, stillOpen)}
`;
fs.writeFileSync(path.join(BRIEF_DIR, `${DATE}.md`), brief);

// --- 4b. spine block (the memory the NEXT run will read) ---------------------
const spineBlock =
`## Run ${DATE}
- NEW: ${isNew.length ? isNew.map((c) => c.key).join("; ") : "(none)"}
- FIXED: ${fixed.length ? fixed.join("; ") : "(none)"}
- STILL OPEN: ${stillOpen.concat(isNew).length ? stillOpen.concat(isNew).map((c) => c.key).join("; ") : "(none)"}
- Posted: yes (outbox/${DATE}.txt)
`;
fs.appendFileSync(SPINE, "\n" + spineBlock);

// --- 4c. "post to Slack" -- here the connector is the filesystem --------------
fs.writeFileSync(
  path.join(OUTBOX, `${DATE}.txt`),
  `[would POST to Slack channel #eng-morning-brief]\n\n` + brief
);

console.log(
  `OK ${DATE}: NEW ${isNew.length}, FIXED ${fixed.length}, STILL OPEN ${stillOpen.concat(isNew).length}. ` +
    `Wrote briefs/${DATE}.md, appended spine.md, wrote outbox/${DATE}.txt.`
);

function parseList(block, label) {
  const m = block.match(new RegExp(`^- ${label}:\\s*(.*)$`, "m"));
  if (!m || /\(none\)/.test(m[1])) return [];
  return m[1]
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}
function riskLine(isNew, stillOpen) {
  const ci = [...isNew, ...stillOpen].find((c) => c.key.startsWith('CI '));
  if (ci) return `- ${ci.label} - a CI failure is unblocking work; triage first.`;
  if (isNew.length) return `- ${isNew[0].label} - newest item since last brief.`;
  if (stillOpen.length) return `- ${stillOpen[0].label} - still unresolved from a prior brief.`;
  return "- Nothing notable. Quiet overnight.";
}
