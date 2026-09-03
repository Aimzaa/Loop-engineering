"use strict";
// Replay the whole 7-day arc: run the scan against each skill-history/day-N.md,
// print the climb, and write metrics.md. (The real loop is one scan per night +
// a human edit each morning; this just shows the seven days end to end.)

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const HERE = __dirname;

const gt = JSON.parse(fs.readFileSync(path.join(HERE, "patterns-full.json"), "utf8")).patterns;
const rows = [];
for (let d = 1; d <= 7; d++) {
  const out = execFileSync(process.execPath, [path.join(HERE, "scan.js"), "--skill", `skill-history/day-${d}.md`, "--date", `2026-09-0${d}`, "--quiet"], { encoding: "utf8" });
  const m = out.match(/caught (\d+)\/(\d+)\s+\[([^\]]*)\]/);
  const added = out.match(/tomorrow add: (\S+)/);
  rows.push({ day: d, caught: Number(m[1]), of: Number(m[2]), ids: m[3], next: added ? added[1] : "-" });
}

let md = `# Dreaming Loop - Metrics\n\nGround truth: ${gt.length} planted patterns in scan-target/payments.js.\n\n`;
md += `| Day | Skill version | Caught | Missed | Next pattern the scan asked for |\n`;
md += `|-----|---------------|--------|--------|----------------------------------|\n`;
for (const r of rows) md += `| ${r.day} | day-${r.day}.md | ${r.caught}/${r.of} | ${r.of - r.caught} | ${r.next} |\n`;
md += `\n## Result\n`;
md += `- Day 1 caught **${rows[0].caught}/${rows[0].of}**; Day 7 caught **${rows[6].caught}/${rows[6].of}**.\n`;
md += `- The loop never rewrote itself. Each morning a human added the one pattern the previous night Missed.\n`;
md += `- Day-1 skill: ${rows[0].ids}\n- Day-7 skill: ${rows[6].ids}\n`;
fs.writeFileSync(path.join(HERE, "metrics.md"), md);

console.log("day | caught | next-asked");
for (const r of rows) console.log(`  ${r.day}  |  ${r.caught}/${r.of}   |  ${r.next}`);
console.log("\nwrote metrics.md");
