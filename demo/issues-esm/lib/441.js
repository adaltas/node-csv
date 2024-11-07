import assert from "node:assert";
import { Database } from "duckdb-async";
import { stringify } from "csv-stringify/sync";

const db = await Database.create(":memory:");
const t = await db.all("SELECT DATE '2022-01-01' as dt");

// Validate that duckdb returns as an instance of JS date
assert(t[0].dt instanceof Date);
// Validate that date objects are handled by `cast.date`
assert.equal(stringify(t, { cast: { date: () => "ok" } }).trim(), "ok");

// First assertion raised in the issue
assert.equal(stringify(t), 1640995200000);
// Second assertion raised in the issue
assert.equal(
  stringify(t, { cast: { date: (x) => x.getTime().toString() } }).trim(),
  1640995200000,
);
