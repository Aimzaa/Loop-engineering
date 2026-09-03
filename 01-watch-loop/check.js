"use strict";
// Checker step for the ISS watch loop — the "checker" half of maker-checker.
// Run this after every beat that appends to spine.json.
// Exit 0 = beat accepted, exit 1 = beat should be rolled back.

const s = require("./spine.json");
const checks = [];
const add = (name, pass) => checks.push([name, !!pass]);

add("valid JSON + readings is an array", Array.isArray(s.readings));
add("readings.length == run_count", s.readings.length === s.run_count);

const ts = s.readings.map((r) => Date.parse(r.ts));
add("timestamps strictly increasing", ts.every((t, i) => i === 0 || t > ts[i - 1]));

// ISS always moves — 3+ identical positions in a row means stale data.
let stuckRun = 1, maxStuck = 1;
for (let i = 1; i < s.readings.length; i++) {
  const a = s.readings[i], b = s.readings[i - 1];
  if (a.lat === b.lat && a.lon === b.lon) stuckRun++;
  else stuckRun = 1;
  maxStuck = Math.max(maxStuck, stuckRun);
}
add("not stuck (no 3x identical positions)", maxStuck < 3);
add("run_count <= max_runs", s.run_count <= s.max_runs);
add("consecutive_failures < 3", (s.consecutive_failures ?? 0) < 3);

let pass = true;
for (const [name, v] of checks) {
  console.log((v ? "PASS  " : "FAIL  ") + name);
  if (!v) pass = false;
}
console.log("\nCHECKER: " + (pass ? "PASS — beat accepted" : "FAIL — roll back this beat"));
process.exit(pass ? 0 : 1);
