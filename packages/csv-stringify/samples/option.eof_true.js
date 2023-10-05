import assert from "assert";
import { stringify } from "csv-stringify/sync";

const data = stringify([
  ["a", "b"],
  ["c", "d"],
]);
assert.deepStrictEqual(data, "a,b\nc,d\n");
