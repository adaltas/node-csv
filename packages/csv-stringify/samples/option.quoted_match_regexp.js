import { stringify } from "csv-stringify";
import assert from "node:assert";

stringify(
  [["a value", ".", "value.with.dot"]],
  {
    quoted_match: /\./,
  },
  function (err, records) {
    assert.equal(records, 'a value,".","value.with.dot"\n');
  },
);
