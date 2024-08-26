import assert from "node:assert";
import { parse } from "csv-parse/sync";

const data = `
2000-01-01,date1
2020-01-01,date2
`.trim();
const records = parse(data, {
  cast: true,
  cast_date: true,
});
assert.deepStrictEqual(records, [
  [new Date("2000-01-01T00:00:00.000Z"), "date1"],
  [new Date("2020-01-01T00:00:00.000Z"), "date2"],
]);
