"use strict";
// Build a 5-business-day arc of signal fixtures from one live fetch, so the
// unattended rehearsal has a story (new P0 appears, gets fixed, quiet day, new P0).
// Usage: node make-fixtures.js
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const dir = path.join(HERE, "fixtures");
fs.mkdirSync(dir, { recursive: true });

const base = JSON.parse(execFileSync(process.execPath, [path.join(HERE, "fetch-signals.js")], { encoding: "utf8" }));
const clone = () => JSON.parse(JSON.stringify(base));

const write = (n, obj) => {
  obj.generated_at = `2026-09-0${n}T08:55:00.000Z`;
  fs.writeFileSync(path.join(dir, `day${n}.json`), JSON.stringify(obj, null, 2));
};

// day 1 - baseline
write(1, clone());

// day 2 - one issue resolved; a new crash report (=> new P0)
let d = clone();
d.issues = d.issues.slice(1);
d.issues.unshift({ key: "#90001", title: "panic: nil map write in `gh pr merge` under load", labels: [], author: "octo-user", url: "https://github.com/cli/cli/issues/90001" });
write(2, d);

// day 3 - the crash is fixed; a confirmed bug lands (=> P1)
d = clone();
d.issues = d.issues.slice(1);
d.issues.unshift({ key: "#90002", title: "gh auth login ignores --hostname on Windows", labels: ["bug"], author: "octo-user", url: "https://github.com/cli/cli/issues/90002" });
write(3, d);

// day 4 - quiet: trim issues and CI, nothing new
d = clone();
d.issues = d.issues.slice(3);
d.ci = d.ci.slice(4);
write(4, d);

// day 5 - a security report (=> new P0) plus the day-4 quiet baseline
d = clone();
d.issues = d.issues.slice(3);
d.ci = d.ci.slice(4);
d.issues.unshift({ key: "#90003", title: "security: token written to debug log at verbose level", labels: ["needs-triage"], author: "sec-reporter", url: "https://github.com/cli/cli/issues/90003" });
write(5, d);

console.log("wrote fixtures/day1.json .. day5.json");
for (let n = 1; n <= 5; n++) {
  const o = JSON.parse(fs.readFileSync(path.join(dir, `day${n}.json`), "utf8"));
  console.log(`  day${n}: ${o.issues.length} issues, ${o.ci.length} CI failures`);
}
