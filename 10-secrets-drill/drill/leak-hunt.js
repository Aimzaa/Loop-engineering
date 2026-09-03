"use strict";
/*
 * Scan this folder's tracked-ish text files (and optionally git history) for
 * secret-shaped strings. Exit 0 = clean, 1 = something leaked.
 *
 * Usage:
 *   node leak-hunt.js           # scan working-tree files
 *   node leak-hunt.js --git     # also scan `git log -p` in this folder
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const withGit = process.argv.includes("--git");

// patterns for common real credential shapes + this drill's fake prefix
const PATTERNS = [
  { name: "drill token", re: /drilltok_[a-z]+_[A-Za-z0-9]{8,}/g },
  { name: "OpenAI-style", re: /sk-(?:live|proj|[A-Za-z0-9]{2,})-?[A-Za-z0-9]{16,}/g },
  { name: "Slack token", re: /xox[baprs]-[A-Za-z0-9-]{10,}/g },
  { name: "GitHub PAT", re: /gh[pousr]_[A-Za-z0-9]{16,}/g },
  { name: "generic assignment", re: /(?:token|secret|api[_-]?key|password)\s*[:=]\s*["'][A-Za-z0-9_\-]{16,}["']/gi },
];

const SKIP_DIRS = new Set(["node_modules", ".git", "outbox"]);
const hits = [];

function scanText(label, text) {
  text.split("\n").forEach((line, i) => {
    for (const p of PATTERNS) {
      p.re.lastIndex = 0;
      if (p.re.test(line)) hits.push({ where: `${label}:${i + 1}`, pattern: p.name, sample: line.trim().slice(0, 100) });
    }
  });
}

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name));
    } else if (/\.(js|md|json|txt|ya?ml|env)$/i.test(e.name) && e.name !== path.basename(__filename)) {
      scanText(path.relative(HERE, path.join(dir, e.name)), fs.readFileSync(path.join(dir, e.name), "utf8"));
    }
  }
}

walk(HERE);

if (withGit) {
  try {
    const log = execFileSync("git", ["-C", HERE, "log", "-p", "--all"], { encoding: "utf8" });
    scanText("git-history", log);
  } catch (e) {
    console.log("(--git: no git repo here yet, skipping history scan)");
  }
}

if (!hits.length) {
  console.log("leak-hunt: CLEAN — no secret-shaped strings found.");
  process.exit(0);
}
console.log(`leak-hunt: ${hits.length} POSSIBLE LEAK(S):`);
for (const h of hits) console.log(`  ${h.where}  [${h.pattern}]  ${h.sample}`);
process.exit(1);
