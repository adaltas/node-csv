import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse";

parse(
  dedent`
    "key_1","key_2"
    "value 1","value 2"
  `,
  {
    columns: (header) => header.map((column) => column.toUpperCase()),
  },
  function (err, records) {
    assert.deepStrictEqual(records, [
      {
        KEY_1: "value 1",
        KEY_2: "value 2",
      },
    ]);
  },
);
