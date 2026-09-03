"use strict";
// Reset the 5-day rehearsal: clear briefs/outbox, trim spine.md to the seed block.
const fs = require("fs");
const path = require("path");
for (const d of ["briefs", "outbox"]) {
  const dir = path.join(__dirname, d);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
}
const SPINE = path.join(__dirname, "spine.md");
const t = fs.readFileSync(SPINE, "utf8");
const i = t.indexOf("\n## Run ", t.indexOf("## Run ") + 1);
fs.writeFileSync(SPINE, i === -1 ? t : t.slice(0, i) + "\n");
console.log("reset: briefs/ + outbox/ cleared, spine.md trimmed to seed.");
