"use strict";

const TIMEOUT_MS = 60000; // per-request timeout
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 250;

// total wait if every retry is exhausted (rough upper bound)
function budgetMs(times) {
  let total = 0;
  for (let i = 0; i < times; i++) total += BACKOFF_BASE_MS * Math.pow(2, i);
  return total + TIMEOUT_MS;
}

function retry(times) {
  return Math.min(times, MAX_RETRIES);
}

module.exports = { TIMEOUT_MS, MAX_RETRIES, BACKOFF_BASE_MS, budgetMs, retry };
