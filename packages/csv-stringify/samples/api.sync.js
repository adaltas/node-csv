import { stringify } from "csv-stringify/sync";
import assert from "node:assert";

const output = stringify([
  ["1", "2", "3", "4"],
  ["a", "b", "c", "d"],
]);

assert.equal(output, "1,2,3,4\na,b,c,d\n");
