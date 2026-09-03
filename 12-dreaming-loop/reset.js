"use strict";
const fs = require("fs");
const path = require("path");
const HERE = __dirname;
fs.copyFileSync(path.join(HERE, "skill-history", "day-1.md"), path.join(HERE, "SKILL.md"));
fs.writeFileSync(
  path.join(HERE, "progress.md"),
  `# Loop Progress - Dreaming Loop\n\nHar raat \`scan.js\` apna block append karta hai. Har subah TUM \`SKILL.md\` mein \`Missed\` ka pehla\npattern add karte ho (skill-history se dekh sakte ho), phir \`skill-history/day-<N>.md\` mein copy.\n`
);
console.log("reset: SKILL.md -> day-1, progress.md -> header only.");
