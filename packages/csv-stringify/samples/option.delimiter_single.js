import { stringify } from "csv-stringify";
import assert from "node:assert";

stringify(
  [
    ["1", "2"],
    ["3", "4"],
  ],
  function (err, records) {
    assert.equal(records, "1,2\n3,4\n");
  },
);
