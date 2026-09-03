"use strict";
// Practice file for the dreaming loop. Kai risky patterns yahan chhupe hain.
// Day-1 skill sirf 2-3 pakdega; baaki har din tum skill mein add karoge.

const DB = require("./fake-db");

// (1) hard-coded secret — day-1 skill ise pakad lega
const STRIPE_KEY = "sk_live_51H8xExampleDoNotUse0000";

// (2) eval — day-1 skill ise pakad lega
function calcDiscount(rule, cart) {
  return eval(rule); // rule string aata hai config se
}

// (3) SQL string concatenation — injection risk — day-1 skill MISS karega
function findUser(name) {
  return DB.query("SELECT * FROM users WHERE name = '" + name + "'");
}

// (4) await inside a loop — sequential, slow — day-1 skill MISS karega
async function chargeAll(customers) {
  const results = [];
  for (const c of customers) {
    results.push(await chargeOne(c));
  }
  return results;
}

// (5) empty catch — errors nigal jaata hai — day-1 skill MISS karega
async function chargeOne(c) {
  try {
    return await DB.query("UPDATE balance SET amount = amount - " + c.amount + " WHERE id = " + c.id);
  } catch (e) {}
}

// (6) no timeout on network call — hang risk — day-1 skill MISS karega
async function callBank(payload) {
  return fetch("https://bank.example.com/transfer", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// (7) Math.random() for a token — not cryptographically safe — day-1 skill MISS karega
function newIdempotencyKey() {
  return "idem_" + Math.random().toString(36).slice(2);
}

// (8) == instead of === with user input — day-1 skill MISS karega
function isAdmin(role) {
  return role == "admin"; // "admin\n", 0, etc. surprises
}

// (9) logging full payload (may contain PII/card) — day-1 skill MISS karega
function audit(payload) {
  console.log("PAYMENT", JSON.stringify(payload));
}

// TODO tighten this before launch
module.exports = {
  calcDiscount,
  findUser,
  chargeAll,
  chargeOne,
  callBank,
  newIdempotencyKey,
  isAdmin,
  audit,
  STRIPE_KEY,
};
