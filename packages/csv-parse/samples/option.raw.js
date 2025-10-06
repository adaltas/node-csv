import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse";

parse(
  dedent`
    a,b,c
    d,e,f
  `,
  { raw: true },
  (err, records) => {
    assert.deepStrictEqual(records, [
      { record: ["a", "b", "c"], raw: "a,b,c\n" },
      { record: ["d", "e", "f"], raw: "d,e,f" },
    ]);
  },
);
