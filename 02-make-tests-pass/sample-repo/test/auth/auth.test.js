"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  validatePassword,
  makeSession,
  isExpired,
  normalizeEmail,
  SESSION_TTL_MS,
} = require("../../src/auth");

test("password of exactly 8 chars is valid", () => {
  assert.equal(validatePassword("abcdefgh"), true);
});

test("password of 7 chars is invalid", () => {
  assert.equal(validatePassword("abcdefg"), false);
});

test("non-string password is invalid", () => {
  assert.equal(validatePassword(12345678), false);
});

test("a fresh session is not expired", () => {
  const s = makeSession("kk", 1000);
  assert.equal(isExpired(s, 2000), false);
});

test("a session past its expiry is expired", () => {
  const s = makeSession("kk", 1000);
  assert.equal(isExpired(s, 1000 + SESSION_TTL_MS + 1), true);
});

test("email is lower-cased and trimmed", () => {
  assert.equal(normalizeEmail("  KK@Example.COM "), "kk@example.com");
});
