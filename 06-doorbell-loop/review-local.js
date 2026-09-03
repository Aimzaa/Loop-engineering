// Local Doorbell checker — run the checklist against a unified diff file,
// without needing GitHub. Produces review.md.
// Usage: node review-local.js path/to/change.diff

const fs = require("fs");

const diffPath = process.argv[2];
if (!diffPath || !fs.existsSync(diffPath)) {
  console.error("Usage: node review-local.js <path-to-diff-file>");
  process.exit(1);
}
const diff = fs.readFileSync(diffPath, "utf8");

// Parse added lines per file with their new-file line numbers.
const added = []; // { file, line, text }
let curFile = null;
let newLine = 0;
for (const raw of diff.split("\n")) {
  if (raw.startsWith("+++ b/")) {
    curFile = raw.slice(6).trim();
    continue;
  }
  const hunk = raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
  if (hunk) {
    newLine = parseInt(hunk[1], 10);
    continue;
  }
  if (raw.startsWith("+") && !raw.startsWith("+++")) {
    added.push({ file: curFile, line: newLine, text: raw.slice(1) });
    newLine++;
  } else if (!raw.startsWith("-")) {
    newLine++;
  }
}

const findings = [];
const flag = (sev, id, f, msg) =>
  findings.push({ sev, id, where: `${f.file}:${f.line}`, msg });

const isTest = (p) => /(\btest\b|\.test\.|\.spec\.|__tests__|_test\.)/i.test(p || "");

const changedLogicFiles = new Set(
  added.filter((a) => !isTest(a.file) && /\.(js|ts|jsx|tsx|py|go|rs|java)$/.test(a.file || "")).map((a) => a.file)
);
const changedTestFiles = new Set(added.filter((a) => isTest(a.file)).map((a) => a.file));

for (const a of added) {
  const t = a.text;
  if (/(api[_-]?key|secret|password|passwd|token)\s*[:=]\s*['"][^'"]{6,}/i.test(t))
    flag("blocker", "B1", a, "Possible hardcoded secret/credential.");
  if (!isTest(a.file) && /\b(console\.log|System\.out\.println)\b/.test(t))
    flag("blocker", "B2", a, "Debug logging left in non-test code.");
  if (!isTest(a.file) && /^\s*print\(/.test(t) && /\.py$/.test(a.file || ""))
    flag("blocker", "B2", a, "Stray print() in non-test Python code.");
  if (/\b(TODO|FIXME|XXX)\b/.test(t) && !/#\d+|issues?\//i.test(t))
    flag("blocker", "B4", a, "TODO/FIXME without an issue link.");
  if (/^\s*\/\/.*[;{}()]/.test(t) || /^\s*#\s*\w+.*[;:]\s*$/.test(t))
    ; // weak signal, skip counting single lines
  if (/:\s*any\b/.test(t) && /\.(ts|tsx)$/.test(a.file || ""))
    flag("warning", "W5", a, "`any` type in new TypeScript code.");
  if (/\bcatch\s*\([^)]*\)\s*\{\s*\}/.test(t))
    flag("warning", "W2", a, "Empty catch block swallows errors.");
  if (/(^|[^\w.])(\d{3,})([^\w]|$)/.test(t) && !/\.(json|md|lock)$/.test(a.file || ""))
    flag("nit", "W3", a, "Magic number — consider a named constant.");
  if (/\s+$/.test(t)) flag("nit", "N1", a, "Trailing whitespace.");
  if (/\b(data2|tmp|foo|bar|baz)\b/.test(t) && !isTest(a.file))
    flag("nit", "N2", a, "Non-descriptive identifier.");
}

// B3: logic changed but no test touched
if (changedLogicFiles.size > 0 && changedTestFiles.size === 0) {
  findings.push({
    sev: "blocker",
    id: "B3",
    where: [...changedLogicFiles].join(", "),
    msg: "Logic files changed but no test file was touched.",
  });
}

// W4: new dependency
for (const a of added) {
  if (/package\.json$/.test(a.file || "") && /^\s*"[^"]+"\s*:\s*"[^"]+"/.test(a.text) && /dependencies/i.test(diff))
    flag("warning", "W4", a, "New dependency added — justify in PR description.");
}

const by = (s) => findings.filter((f) => f.sev === s);
const b = by("blocker"), w = by("warning"), n = by("nit");

let md = `## Doorbell review — ${findings.length} findings (${b.length} blockers, ${w.length} warnings, ${n.length} nits)\n\n`;
for (const [title, arr] of [["Blockers", b], ["Warnings", w], ["Nits", n]]) {
  if (!arr.length) continue;
  md += `### ${title}\n`;
  for (const f of arr) md += `- \`${f.where}\` — ${f.id} — ${f.msg}\n`;
  md += "\n";
}
if (!findings.length) md += "LGTM — checklist clean.\n\n";
md += "_Checker only — merge decision stays with a human._\n";

fs.writeFileSync(__dirname + "/review.md", md);
console.log(md);
process.exit(b.length > 0 ? 1 : 0);
