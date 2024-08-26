import { stringify } from "csv-stringify/sync";
import assert from "node:assert";

const records = stringify([['a "value"']], { escape: "\\" });

assert.equal(records, '"a \\"value\\""\n');
