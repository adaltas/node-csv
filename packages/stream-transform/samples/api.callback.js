import { transform } from "stream-transform";
import assert from "node:assert";

transform(
  [
    ["1", "2", "3", "4"],
    ["a", "b", "c", "d"],
  ],
  function (record) {
    record.push(record.shift());
    return record;
  },
  function (err, output) {
    assert.deepEqual(output, [
      ["2", "3", "4", "1"],
      ["b", "c", "d", "a"],
    ]);
  },
);
