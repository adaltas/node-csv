import assert from "node:assert";
import { parse } from "csv-parse/sync";

const data = "a,:b:c\nd:e:,f";
const records = parse(data, {
  delimiter_auto: true,
});
assert.deepStrictEqual(records, [
  ["a,", "b", "c"],
  ["d", "e", ",f"],
]);
