import { stringify } from "csv-stringify";
import assert from "node:assert";

stringify(
  [["1", "", true, 2]],
  {
    quoted_string: true,
  },
  function (err, records) {
    assert.equal(records, '"1","",1,2\n');
  },
);
