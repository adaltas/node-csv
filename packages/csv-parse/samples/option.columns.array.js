import assert from "node:assert";
import { parse } from "csv-parse";

parse(
  '"value 1","value 2"',
  {
    columns: ["key_1", "key_2"],
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
