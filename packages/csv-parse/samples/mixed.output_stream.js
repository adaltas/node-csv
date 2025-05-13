import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse";

const records = [];
parse(
  dedent`
    "1","2","3"
    "a","b","c"
  `,
  {
    trim: true,
    skip_empty_lines: true,
  },
)
  // Use the readable stream api
  .on("readable", function () {
    let record;
    while ((record = this.read()) !== null) {
      records.push(record);
    }
  })
  // When we are done, test that the parsed records matched what expected
  .on("end", function () {
    assert.deepStrictEqual(records, [
      ["1", "2", "3"],
      ["a", "b", "c"],
    ]);
  });
