import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse/sync";

const records = parse(
  dedent`
    "a","b","c"

    "d","e","f"
  `,
  {
    skip_empty_lines: true,
  },
);

assert.deepStrictEqual(records, [
  ["a", "b", "c"],
  ["d", "e", "f"],
]);
