const assert = require("node:assert");
const version = parseInt(/^v(\d+)/.exec(process.version)[1], 10);
const { parse } = require(
  version >= 14 ? "csv-parse/sync" : "csv-parse/dist/cjs/sync.cjs",
);

// Create the parser
const records = parse(["a:b:c\n", "1:2:3\n"].join(""), {
  delimiter: ":",
});
// Test that the parsed records matched what's expected
assert.deepStrictEqual(records, [
  ["a", "b", "c"],
  ["1", "2", "3"],
]);
