import { stringify } from "csv-stringify/sync";
import assert from "node:assert";

const records = stringify([["a,b"]], {
  quote: "|",
});

assert.equal(records, "|a,b|\n");
