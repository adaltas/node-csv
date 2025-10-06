import { stringify } from "csv-stringify/sync";
import assert from "node:assert";

const records = stringify(
  [
    ["a", "b"],
    ["c", "d"],
  ],
  {
    record_delimiter: "|",
    eof: false,
  },
);

assert.equal(records, "a,b|c,d");
