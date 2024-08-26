import assert from "node:assert";
import { parse } from "csv-parse";

const input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"';
parse(
  input,
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
