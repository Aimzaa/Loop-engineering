"use strict";
/*
 * One "beat" of a loop that needs a credential.
 * RULE: the secret comes ONLY from the environment (process.env.DRILL_TOKEN),
 *       is used in a connector call, and NEVER appears in clear text in any
 *       console output or persisted file.
 *
 * Usage (PowerShell):
 *   $env:DRILL_TOKEN = "<paste-the-token-here>"
 *   node use-secret.js
 */

const fs = require("fs");
const path = require("path");

const token = process.env.DRILL_TOKEN;

// --- guard 1: secret must be present in the environment ---
if (!token) {
  console.error("FAIL: DRILL_TOKEN not in environment. Set it before running (never hard-code it).");
  process.exit(1);
}

// --- guard 2: the secret must NOT be hard-coded in this loop's own source ---
const srcDir = __dirname;
if (fs.readFileSync(__filename, "utf8").includes(token)) {
  console.error("FAIL: DRILL_TOKEN's literal value is hard-coded in use-secret.js. Remove it.");
  process.exit(1);
}

// mask helper: only ever show last 4 chars + length
const mask = (s) => `****${s.slice(-4)} (len ${s.length})`;

// --- the "connector call" (local stand-in for a real Slack/API call) ---
// A real call would put the token in an Authorization header over TLS.
// Here we record the request to outbox/, with the token MASKED in what we persist.
const outbox = path.join(srcDir, "outbox");
fs.mkdirSync(outbox, { recursive: true });
const n = fs.readdirSync(outbox).filter((x) => x.startsWith("request-")).length + 1;
const request = {
  when: new Date().toISOString(),
  url: "https://api.example.com/v1/ping",
  method: "POST",
  headers: { Authorization: `Bearer ${mask(token)}` }, // masked on disk
  body: { msg: "loop beat ok" },
};
fs.writeFileSync(path.join(outbox, `request-${n}.json`), JSON.stringify(request, null, 2));

console.log(`connector call OK  (token ${mask(token)})  -> wrote outbox/request-${n}.json`);
console.log("the token was read from env, used in the call, and never printed or persisted in clear.");
