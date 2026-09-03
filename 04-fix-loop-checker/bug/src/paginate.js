"use strict";

/**
 * Return the slice of `items` belonging to `page` (1-indexed).
 * Example: paginate([1..10], 1, 3) -> [1, 2, 3]
 */
function paginate(items, page, perPage) {
  const start = page * perPage;
  return items.slice(start, start + perPage);
}

/**
 * How many pages `count` items span at `perPage` per page.
 * Example: pageCount(10, 3) -> 4
 */
function pageCount(count, perPage) {
  return Math.floor(count / perPage);
}

module.exports = { paginate, pageCount };
