"use strict";
const fs = require("fs");
const path = require("path");
const HERE = __dirname;

const BASELINE = `"use strict";

const TIMEOUT_MS = 30000; // per-request timeout
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 250;

// total wait if every retry is exhausted (rough upper bound)
function budgetMs(times) {
  let total = 0;
  for (let i = 0; i < times; i++) total += BACKOFF_BASE_MS * Math.pow(2, i);
  return total + TIMEOUT_MS;
}

function retry(times) {
  return Math.min(times, MAX_RETRIES);
}

module.exports = { TIMEOUT_MS, MAX_RETRIES, BACKOFF_BASE_MS, budgetMs, retry };
`;

// wipe PRs
const prs = path.join(HERE, "prs");
if (fs.existsSync(prs)) fs.rmSync(prs, { recursive: true, force: true });
fs.mkdirSync(prs, { recursive: true });

// restore main/config.js to its pristine baseline
fs.writeFileSync(path.join(HERE, "main", "config.js"), BASELINE);

// trim progress.md to the seed block
const P = path.join(HERE, "progress.md");
const t = fs.readFileSync(P, "utf8");
const i = t.indexOf("\n## ", t.indexOf("## ") + 1);
fs.writeFileSync(P, i === -1 ? t : t.slice(0, i) + "\n");

console.log("reset: prs/ wiped, main/config.js restored, progress.md trimmed to seed.");
