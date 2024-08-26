import assert from "node:assert";
import { parse } from "csv-parse/sync";

const records = parse("a ,1\nb, 2\n c,3", {
  trim: true,
});
assert.deepStrictEqual(records, [
  ["a", "1"],
  ["b", "2"],
  ["c", "3"],
]);
