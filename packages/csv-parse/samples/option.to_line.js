import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse/sync";

const records = parse(
  dedent`
    a,1
    b,1
    x,x
  `,
  {
    to_line: 2,
  },
);
assert.deepStrictEqual(records, [
  ["a", "1"],
  ["b", "1"],
]);
