import { transform } from "stream-transform";
import assert from "node:assert";

const records = [];
// Create the parser
transform(
  [
    ["1", "2", "3", "4"],
    ["a", "b", "c", "d"],
  ],
  function (record) {
    record.push(record.shift());
    return record;
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
      ["2", "3", "4", "1"],
      ["b", "c", "d", "a"],
    ]);
  });
