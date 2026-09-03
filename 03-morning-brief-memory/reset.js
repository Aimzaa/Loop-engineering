"use strict";
// Reset the rehearsal: clear generated briefs/outbox and trim spine.md back to the seed block.
// Usage: node reset.js
const fs = require("fs");
const path = require("path");

for (const d of ["briefs", "outbox"]) {
  const dir = path.join(__dirname, d);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
}

const SPINE = path.join(__dirname, "spine.md");
const text = fs.readFileSync(SPINE, "utf8");
// keep everything up to and including the first (seed) run block, drop later blocks
const idx = text.indexOf("\n## Run ", text.indexOf("## Run ") + 1);
fs.writeFileSync(SPINE, idx === -1 ? text : text.slice(0, idx) + "\n");
console.log("reset: briefs/ and outbox/ cleared, spine.md trimmed to seed block.");
