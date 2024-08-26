import { transform } from "stream-transform";
import assert from "node:assert";

// Create the parser
const transformer = transform(
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
// Write data to the stream
transformer.write(["1", "2", "3", "4"]);
transformer.write(["a", "b", "c", "d"]);
// Close the readable stream
transformer.end();
