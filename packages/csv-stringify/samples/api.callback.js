import assert from "node:assert";
import { stringify } from "csv-stringify";

stringify(
  [
    ["1", "2", "3", "4"],
    ["a", "b", "c", "d"],
  ],
  function (err, output) {
    assert.equal(output, "1,2,3,4\na,b,c,d\n");
  },
);
