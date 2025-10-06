import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse";

parse(
  dedent`
    "a 1","a 2"
    "b 1"
    "c 1","c 2","c 3"
  `,
  {
    relax_column_count: true,
  },
  function (err, records) {
    assert.deepStrictEqual(records, [
      ["a 1", "a 2"],
      ["b 1"],
      ["c 1", "c 2", "c 3"],
    ]);
  },
);
