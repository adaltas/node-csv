import assert from "node:assert";
// Node.js >= 14
import { parse } from "csv-parse/sync";
// Node.js < 14
// import { parse } from 'csv-parse/dist/cjs/sync'

// Create the parser
const records: [] = parse(["a:b:c\n", "1:2:3\n"].join(""), {
  delimiter: ":",
});
// Test that the parsed records matched what's expected
assert.deepStrictEqual(records, [
  ["a", "b", "c"],
  ["1", "2", "3"],
]);
