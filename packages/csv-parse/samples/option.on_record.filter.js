import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse";

parse(
  dedent`
    line 1
    line 2
    line 3
  `,
  {
    on_record: (record, { lines }) => (lines === 2 ? null : record),
  },
  function (err, records) {
    assert.deepStrictEqual(records, [["line 1"], ["line 3"]]);
  },
);
