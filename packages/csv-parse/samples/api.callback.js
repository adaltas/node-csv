import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse";

parse(
  dedent`
    # Welcome
    "1","2","3","4"
    "a","b","c","d"
  `,
  {
    comment: "#",
  },
  function (err, records) {
    assert.deepStrictEqual(records, [
      ["1", "2", "3", "4"],
      ["a", "b", "c", "d"],
    ]);
  },
);
