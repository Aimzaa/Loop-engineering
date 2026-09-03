"use strict";
/*
 * A tiny run-until-done loop with all 5 parts visible, so Project 7 can break each one.
 *
 *   HEARTBEAT : the `while` loop below (one beat per turn)
 *   SKILL     : skill.md  -> tells the maker its STEP
 *   MAKER     : adds STEP to work.value
 *   CHECKER   : a SEPARATE function that grades work.value against GOAL (maker never self-approves)
 *   SPINE     : spine.json -> memory BETWEEN whole runs (run count, last status/value)
 *   STOPS     : (1) success  (2) retry limit  (3) stuck detection
 *
 * Break one part with a flag, observe the failure, then run with no flag to restore:
 *   node loop.js                     # healthy
 *   node loop.js --break stopcond    # remove stopping conditions -> runaway
 *   node loop.js --break skill       # ignore skill.md -> maker runs blind
 *   node loop.js --break checker     # remove maker/checker split -> maker self-approves
 *   node loop.js --break spine       # ignore spine.json -> prior runs' memory lost
 */

const fs = require("fs");
const path = require("path");
const HERE = __dirname;

const BREAK = (() => {
  const i = process.argv.indexOf("--break");
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : "none";
})();

const GOAL = 5;
const MAX_ITERS = 20;   // retry-limit stop
const STUCK_LIMIT = 3;  // stuck-detection stop
const SAFETY_CAP = 40;  // NOT a real stop -- demo backstop so a broken loop is observable, not a hang

console.log(`--- loop run (break: ${BREAK}) ---`);

// ---- SKILL ----
let step = 1;
if (BREAK === "skill") {
  step = 3; // blind guess -- no skill to read
  console.log("skill: IGNORED (--break skill) -> maker blind, guessing STEP=3");
} else {
  try {
    const m = fs.readFileSync(path.join(HERE, "skill.md"), "utf8").match(/STEP\s*=\s*(-?\d+)/);
    step = m ? Number(m[1]) : 1;
    console.log(`skill: loaded (STEP=${step})`);
  } catch (e) {
    step = 0;
    console.log("skill: FILE MISSING -> maker has no STEP, cannot make progress (blind beat)");
  }
}

// ---- SPINE (memory between runs) ----
const SPINE = path.join(HERE, "spine.json");
let spine = { runs: 0, last_status: null, last_value: null, history: [] };
if (BREAK === "spine") {
  console.log("spine: IGNORED (--break spine) -> no memory of prior runs, starting blank");
} else {
  try {
    spine = JSON.parse(fs.readFileSync(SPINE, "utf8"));
    console.log(`spine: loaded (prior runs=${spine.runs}, last_status=${spine.last_status}, last_value=${spine.last_value})`);
  } catch (e) {
    console.log("spine: none yet -> first run");
  }
}

// ---- WORK: fresh solve each run ----
let work = { value: 0 };

function maker() {
  work.value += step;
  return work.value;
}

// ---- CHECKER: separate grader ----
function checker(v) {
  return v === GOAL
    ? { done: true, reason: `value ${v} === goal ${GOAL}` }
    : { done: false, reason: `value ${v} !== goal ${GOAL}` };
}

// ---- HEARTBEAT ----
let iter = 0, stuck = 0, prev = null, status = "running";
while (true) {
  iter++;
  const v = maker();

  let verdict;
  if (BREAK === "checker") {
    verdict = { done: true, reason: "MAKER SELF-APPROVED (no checker) -- claims done regardless of value" };
  } else {
    verdict = checker(v);
  }

  if (prev !== null && v === prev) stuck++; else stuck = 0;
  prev = v;

  console.log(`beat ${iter}: value=${v}  ->  ${verdict.reason}`);

  // ---- STOP 1: success ----
  if (verdict.done && BREAK !== "stopcond") { status = "success"; console.log("STOP: success condition met"); break; }
  // ---- STOP 2: retry limit ----
  if (iter >= MAX_ITERS && BREAK !== "stopcond") { status = "retry-limit"; console.log(`STOP: retry limit (${MAX_ITERS}) hit`); break; }
  // ---- STOP 3: stuck ----
  if (stuck >= STUCK_LIMIT && BREAK !== "stopcond") { status = "stuck"; console.log(`STOP: stuck (${STUCK_LIMIT} beats, no change)`); break; }

  // demo backstop (not a real stop)
  if (iter >= SAFETY_CAP) {
    status = "RUNAWAY";
    console.log(`\n!!! ${SAFETY_CAP} beats and NO stop condition fired.`);
    console.log("!!! A real loop here would run forever, burning tokens/quota. Demo backstop killed it.");
    break;
  }
}

// ---- persist SPINE ----
if (BREAK !== "spine") {
  spine.runs = (spine.runs || 0) + 1;
  spine.last_status = status;
  spine.last_value = work.value;
  spine.history = (spine.history || []).concat([{ run: spine.runs, status, value: work.value, iters: iter }]);
  fs.writeFileSync(SPINE, JSON.stringify(spine, null, 2));
}

console.log(`\nRESULT: status=${status}  iterations=${iter}  final value=${work.value}`);
if (BREAK === "checker" && status === "success" && work.value !== GOAL) {
  console.log(`WARNING: loop reported success but value ${work.value} != goal ${GOAL}. Self-approval let a wrong result through.`);
}
process.exit(status === "success" ? 0 : 1);
