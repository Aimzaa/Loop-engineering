"use strict";
// Overnight signals for the daily-triage loop: recently-updated open issues (with labels)
// + recent failed CI runs, from a public GitHub repo. No auth (~60 req/hr).
// Usage: node fetch-signals.js [--repo owner/name] [--hours N]
// Prints one JSON object to stdout.

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const REPO = opt("--repo", "cli/cli");
const HOURS = Number(opt("--hours", "24"));
const H = { "User-Agent": "loop-eng-daily-triage", Accept: "application/vnd.github+json" };
const since = Date.now() - HOURS * 3600 * 1000;

(async () => {
  const ir = await fetch(
    `https://api.github.com/repos/${REPO}/issues?state=open&sort=updated&direction=desc&per_page=30`,
    { headers: H, signal: AbortSignal.timeout(15000) }
  );
  if (!ir.ok) throw new Error(`issues HTTP ${ir.status}`);
  const issues = (await ir.json())
    .filter((it) => !it.pull_request && Date.parse(it.updated_at) >= since)
    .map((it) => ({
      key: `#${it.number}`,
      title: it.title.slice(0, 90),
      labels: (it.labels || []).map((l) => (typeof l === "string" ? l : l.name)),
      author: it.user && it.user.login,
      url: it.html_url,
    }));

  const rr = await fetch(
    `https://api.github.com/repos/${REPO}/actions/runs?status=failure&per_page=20`,
    { headers: H, signal: AbortSignal.timeout(15000) }
  );
  if (!rr.ok) throw new Error(`runs HTTP ${rr.status}`);
  const ci = ((await rr.json()).workflow_runs || [])
    .filter((r) => Date.parse(r.created_at) >= since)
    .map((r) => ({ key: `CI "${r.name}" (${r.head_branch})`, name: r.name, branch: r.head_branch, url: r.html_url }));

  process.stdout.write(
    JSON.stringify({ repo: REPO, window_hours: HOURS, generated_at: new Date().toISOString(), issues, ci }, null, 2) + "\n"
  );
})().catch((e) => {
  console.error("FETCH_FAILED:", e.message || e);
  process.exit(1);
});
