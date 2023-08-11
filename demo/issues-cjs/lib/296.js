const { stringify } = require("csv-stringify/sync");
const assert = require("assert");

try {
  stringify([1, { a: "3", b: "4" }]);
  process.exit(1);
} catch (err) {
  console.info(err.message);
  assert.equal(
    err.message,
    "Invalid Record: expect an array or an object, got 1"
  );
}
