import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse";

parse(
  dedent`
    "key_1","key_2"
    "value 1","value 2"
  `,
  {
    columns: true,
  },
  function (err, records) {
    assert.deepStrictEqual(records, [
      {
        key_1: "value 1",
        key_2: "value 2",
      },
    ]);
  },
);
