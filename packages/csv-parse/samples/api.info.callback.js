import assert from "node:assert";
import { parse } from "csv-parse";

parse("1,2,3\na,b,c", (err, data, { lines, records }) => {
  assert.equal(
    `There are ${lines} lines with ${records} records.`,
    "There are 2 lines with 2 records.",
  );
});
