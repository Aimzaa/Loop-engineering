"use strict";

const MIN_PASSWORD_LEN = 8;
const SESSION_TTL_MS = 1000 * 60 * 60; // 1 hour

// A password of exactly MIN_PASSWORD_LEN characters or more is valid.
function validatePassword(pw) {
  return typeof pw === "string" && pw.length >= MIN_PASSWORD_LEN;
}

function makeSession(user, now) {
  const startedAt = now === undefined ? Date.now() : now;
  return { user: user, createdAt: startedAt, expiresAt: startedAt + SESSION_TTL_MS };
}

// A session is expired once "now" has passed its expiresAt timestamp.
function isExpired(session, now) {
  const t = now === undefined ? Date.now() : now;
  return t > session.expiresAt;
}

// Lower-case and trim surrounding whitespace.
function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

module.exports = {
  MIN_PASSWORD_LEN,
  SESSION_TTL_MS,
  validatePassword,
  makeSession,
  isExpired,
  normalizeEmail,
};
