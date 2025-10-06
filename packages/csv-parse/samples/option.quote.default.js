import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse/sync";

const records = parse(
  dedent`
    a,"b",c
    "d",e,"f"
  `,
);

assert.deepStrictEqual(records, [
  ["a", "b", "c"],
  ["d", "e", "f"],
]);
