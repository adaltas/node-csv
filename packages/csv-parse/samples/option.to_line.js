import assert from "node:assert";
import { parse } from "csv-parse/sync";

const records = parse(
  `
a,1
b,1
x,x
`.trim(),
  {
    to_line: 2,
  },
);
assert.deepStrictEqual(records, [
  ["a", "1"],
  ["b", "1"],
]);
