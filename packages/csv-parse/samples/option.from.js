import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse";

parse(
  dedent`
    a,b
    1,2
    3,4
    5,6
  `,
  {
    columns: true,
    from: 2,
  },
  function (err, records) {
    assert.deepStrictEqual(records, [
      {
        a: "3",
        b: "4",
      },
      {
        a: "5",
        b: "6",
      },
    ]);
  },
);
