"use strict";
// MAKER for the daily-triage loop.
//   1. read rules.json      -> YOUR project's triage rules (P0/P1/P2 + ignore)
//   2. read spine.md        -> yesterday's still-open P0/P1 (memory)
//   3. read signals         -> --fixture <file>, or piped stdin, or live fetch-signals.js
//   4. classify each signal -> ignore / P0 / P1 / P2  (first matching priority wins)
//   5. write briefs/<date>.md (action-oriented), append spine.md block, write outbox/<date>.txt
//
// Usage:
//   node triage.js [--date YYYY-MM-DD] [--fixture fixtures/day1.json]
// Idempotent: if spine.md already has a block for <date>, exits without changes.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const DATE = opt("--date", new Date().toISOString().slice(0, 10));

const rules = JSON.parse(fs.readFileSync(path.join(HERE, "rules.json"), "utf8"));
const SPINE = path.join(HERE, "spine.md");
const BRIEFS = path.join(HERE, "briefs");
const OUTBOX = path.join(HERE, "outbox");
for (const d of [BRIEFS, OUTBOX]) fs.mkdirSync(d, { recursive: true });

// ---- 1. memory: yesterday's still-open P0/P1 ----
const spineText = fs.existsSync(SPINE) ? fs.readFileSync(SPINE, "utf8") : "";
if (new RegExp(`^## Run ${DATE}\\b`, "m").test(spineText)) {
  console.log(`SKIP: spine.md already has a block for ${DATE} (idempotent guard).`);
  process.exit(0);
}
const blocks = spineText.split(/^## Run /m).slice(1);
const lastBlock = blocks.length ? blocks[blocks.length - 1] : "";
const carriedIn = parseKeys(lastBlock, "OPEN P0/P1 carried");

// ---- 2. signals ----
const fixture = opt("--fixture", null);
let raw = "";
let src = "";
if (fixture) {
  const p = [path.resolve(process.cwd(), fixture), path.join(HERE, fixture)].find((x) => fs.existsSync(x));
  if (!p) { console.error(`ERROR: --fixture not found: ${fixture}`); process.exit(1); }
  raw = fs.readFileSync(p, "utf8"); src = `fixture ${path.basename(p)}`;
} else if (!process.stdin.isTTY) {
  try { raw = fs.readFileSync(0, "utf8"); } catch (_) {}
  src = "stdin";
}
if (!raw.trim()) {
  raw = execFileSync(process.execPath, [path.join(HERE, "fetch-signals.js")], { encoding: "utf8" });
  src = "live fetch";
}
let signals;
try { signals = JSON.parse(raw); }
catch (e) { console.error(`ERROR: signals (${src}) not valid JSON: ${e.message}`); process.exit(1); }
console.log(`signals: ${src}  (${signals.issues.length} issues, ${signals.ci.length} CI failures)`);

// ---- 3. classify ----
const items = [
  ...signals.issues.map((i) => ({ kind: "issue", key: i.key, title: i.title, labels: i.labels || [], author: i.author, url: i.url })),
  ...signals.ci.map((c) => ({ kind: "ci", key: c.key, title: c.name, branch: c.branch, labels: [], url: c.url })),
];

function ruleHits(rule, it) {
  switch (rule.match) {
    case "label": return it.labels.includes(rule.value);
    case "author": return it.author === rule.value;
    case "title_regex": return new RegExp(rule.value, "i").test(it.title);
    case "ci_branch": return it.kind === "ci" && it.branch === rule.value;
    case "ci_any": return it.kind === "ci";
    default: return false;
  }
}
function classify(it) {
  if ((rules.ignore || []).some((r) => ruleHits(r, it))) return { pri: "IGNORE" };
  for (const pri of ["P0", "P1", "P2"]) {
    const hit = (rules[pri] || []).find((r) => ruleHits(r, it));
    if (hit) return { pri, why: hit.why };
  }
  return { pri: "P2", why: "uncategorised - default bucket" };
}

const bucket = { P0: [], P1: [], P2: [], IGNORE: [] };
for (const it of items) {
  const c = classify(it);
  it.why = c.why;
  it.carried = carriedIn.includes(it.key);
  bucket[c.pri].push(it);
}

const nextStep = (it) =>
  it.kind === "ci"
    ? "re-run once; if still red, page the last committer on that branch"
    : it.labels.includes("needs-triage")
    ? "assign an owner in standup"
    : "confirm repro, then size it";

// ---- 4a. brief ----
const sec = (arr) =>
  arr.length
    ? arr.map((it) => `- ${it.key} | ${it.title.slice(0, 60)} | ${it.why}${it.carried ? " | CARRIED from a prior day" : ""}\n    -> ${nextStep(it)}`).join("\n")
    : "- (none)";

const brief =
`# Daily Triage - ${DATE}
_project: ${rules.project} | window: ${signals.window_hours}h | channel: ${rules.channel}_
${bucket.P0.length ? "\n@here - P0 items need eyes now.\n" : ""}
## P0 (${bucket.P0.length})
${sec(bucket.P0)}

## P1 (${bucket.P1.length})
${sec(bucket.P1)}

## P2 (${bucket.P2.length})
${sec(bucket.P2)}

## Biggest risk today
${riskLine(bucket)}

_ignored this run: ${bucket.IGNORE.length} (${(rules.ignore || []).map((r) => r.value).join(", ") || "-"})_
`;
fs.writeFileSync(path.join(BRIEFS, `${DATE}.md`), brief);

// ---- 4b. spine block (memory for tomorrow) ----
const openKeys = [...bucket.P0, ...bucket.P1].map((it) => it.key);
const fixed = carriedIn.filter((k) => !openKeys.includes(k));
const spineBlock =
`## Run ${DATE}
- P0: ${bucket.P0.length ? bucket.P0.map((i) => i.key).join("; ") : "(none)"}
- P1 count: ${bucket.P1.length}
- P2 count: ${bucket.P2.length}
- FIXED since last run: ${fixed.length ? fixed.join("; ") : "(none)"}
- OPEN P0/P1 carried: ${openKeys.length ? openKeys.join("; ") : "(none)"}
- Posted: yes (outbox/${DATE}.txt)
`;
fs.appendFileSync(SPINE, "\n" + spineBlock);

// ---- 4c. "post" ----
fs.writeFileSync(path.join(OUTBOX, `${DATE}.txt`), `[would POST to Slack ${rules.channel}]\n\n` + brief);

console.log(
  `OK ${DATE}: P0 ${bucket.P0.length}, P1 ${bucket.P1.length}, P2 ${bucket.P2.length}, ignored ${bucket.IGNORE.length}, fixed-since-last ${fixed.length}.`
);

function parseKeys(block, label) {
  const m = block.match(new RegExp(`^- ${label}:\\s*(.*)$`, "m"));
  if (!m || /\(none\)/.test(m[1])) return [];
  return m[1].split(";").map((s) => s.trim()).filter(Boolean);
}
function riskLine(b) {
  if (b.P0.length) return `- ${b.P0[0].key} ${b.P0[0].title.slice(0, 50)} - highest P0, act first.`;
  if (b.P1.length) return `- ${b.P1.length} P1 items open, no P0 - work the oldest P1.`;
  return "- Quiet. No P0/P1. Good day to burn down P2.";
}
