import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse";

parse(
  dedent`
    a,b
    c,d,e
  `,
  {
    relax_column_count_more: true,
  },
  (err, records) => {
    assert.deepStrictEqual(records, [
      ["a", "b"],
      ["c", "d", "e"],
    ]);
  },
);
