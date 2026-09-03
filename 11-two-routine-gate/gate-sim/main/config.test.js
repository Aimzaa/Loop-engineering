"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const cfg = require("./config");

test("retry is capped at MAX_RETRIES", () => {
  assert.equal(cfg.retry(99), cfg.MAX_RETRIES);
  assert.equal(cfg.retry(1), 1);
});

test("budgetMs includes the request timeout", () => {
  assert.ok(cfg.budgetMs(0) >= cfg.TIMEOUT_MS);
});

test("budgetMs grows with more retries", () => {
  assert.ok(cfg.budgetMs(3) > cfg.budgetMs(1));
});
