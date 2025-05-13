import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse/sync";

const records = parse(
  dedent`
    a,"b""b",c
    d,"e""e",f
  `,
);

assert.deepStrictEqual(records, [
  ["a", 'b"b', "c"],
  ["d", 'e"e', "f"],
]);
