"use strict";
// Fetch "overnight signals" for the morning brief: recently-updated open issues
// and recent failed CI runs for a public GitHub repo. No auth (public REST API,
// ~60 req/hour). This is the CONNECTOR part of the loop.
//
// Usage:
//   node fetch-signals.js [--repo owner/name] [--hours N] [--fixture path.json]
// Prints one JSON object to stdout.

const fs = require("fs");

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};

const REPO = opt("--repo", "cli/cli");
const HOURS = Number(opt("--hours", "24"));
const FIXTURE = opt("--fixture", null);

if (FIXTURE) {
  // Deterministic mode: replay a saved/edited signal set (used to rehearse the loop).
  process.stdout.write(fs.readFileSync(FIXTURE, "utf8"));
  return;
}

const H = {
  "User-Agent": "loop-eng-morning-brief",
  Accept: "application/vnd.github+json",
};
const since = Date.now() - HOURS * 3600 * 1000;

(async () => {
  const issuesRes = await fetch(
    `https://api.github.com/repos/${REPO}/issues?state=open&sort=updated&direction=desc&per_page=30`,
    { headers: H, signal: AbortSignal.timeout(15000) }
  );
  if (!issuesRes.ok) throw new Error(`issues HTTP ${issuesRes.status}`);
  const issuesRaw = await issuesRes.json();
  const issues = issuesRaw
    .filter((it) => !it.pull_request) // the issues endpoint also returns PRs
    .filter((it) => Date.parse(it.updated_at) >= since)
    .map((it) => ({
      key: `#${it.number}`,
      title: it.title.slice(0, 80),
      labels: (it.labels || []).map((l) => (typeof l === "string" ? l : l.name)),
      updated_at: it.updated_at,
      url: it.html_url,
    }));

  const runsRes = await fetch(
    `https://api.github.com/repos/${REPO}/actions/runs?status=failure&per_page=20`,
    { headers: H, signal: AbortSignal.timeout(15000) }
  );
  if (!runsRes.ok) throw new Error(`actions/runs HTTP ${runsRes.status}`);
  const runsRaw = await runsRes.json();
  const ci_failures = (runsRaw.workflow_runs || [])
    .filter((r) => Date.parse(r.created_at) >= since)
    .map((r) => ({
      key: `CI "${r.name}" (${r.head_branch})`,
      name: r.name,
      branch: r.head_branch,
      created_at: r.created_at,
      url: r.html_url,
    }));

  process.stdout.write(
    JSON.stringify(
      { repo: REPO, window_hours: HOURS, generated_at: new Date().toISOString(), issues, ci_failures },
      null,
      2
    ) + "\n"
  );
})().catch((e) => {
  console.error("FETCH_FAILED:", e.message || e);
  process.exit(1);
});
