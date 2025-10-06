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
    to: 2,
  },
  function (err, records) {
    console.info(err, records);
    assert.deepStrictEqual(records, [
      {
        a: "1",
        b: "2",
      },
      {
        a: "3",
        b: "4",
      },
    ]);
  },
);
