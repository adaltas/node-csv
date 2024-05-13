
import assert from "node:assert";
import { parse } from "csv-parse/sync";

const data = `
  1,2,3
  4,5,6
`.trim();
const records = parse(data, {
  // The cast option exect a function which
  // is called with two arguments,
  // the parsed value and a context object
  cast: function (value, context) {
    // Index indicates the column position
    if (context.index === 0) {
      // Return the value untouched
      return value;
    } else if (context.index === 1) {
      // Convert the value to a string
      return parseInt(value);
    } else {
      // Return a different value
      return `Value is ${value}`;
    }
  },
  trim: true,
});
assert.deepStrictEqual(records, [
  [ "1", 2, "Value is 3" ],
  [ "4", 5, "Value is 6" ],
]);
