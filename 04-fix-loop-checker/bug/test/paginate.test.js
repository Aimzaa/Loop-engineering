"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { paginate, pageCount } = require("../src/paginate");

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

test("page 1 returns the first perPage items", () => {
  assert.deepEqual(paginate(items, 1, 3), [1, 2, 3]);
});

test("page 2 returns the next perPage items", () => {
  assert.deepEqual(paginate(items, 2, 3), [4, 5, 6]);
});

test("last page returns the remainder", () => {
  assert.deepEqual(paginate(items, 4, 3), [10]);
});

test("pageCount rounds up for a partial last page", () => {
  assert.equal(pageCount(10, 3), 4);
});

test("pageCount is exact when it divides evenly", () => {
  assert.equal(pageCount(9, 3), 3);
});
