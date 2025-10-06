import assert from "node:assert";
import { stringify } from "csv-stringify";

const data = [];
stringify([
  ["1", "2", "3", "4"],
  ["a", "b", "c", "d"],
])
  // Use the readable stream api
  .on("readable", function () {
    let row;
    while ((row = this.read()) !== null) {
      data.push(row);
    }
  })
  // When we are done, test that the parsed records matched what expected
  .on("end", function () {
    assert.deepStrictEqual(data.join(""), "1,2,3,4\na,b,c,d\n");
  });
