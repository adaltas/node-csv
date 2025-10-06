import assert from "node:assert";
import { parse } from "csv-parse";

const parser = parse("1,2,3\na,b,c");
// Report information for every record
parser.on("readable", () => {
  while (parser.read() !== null) {
    const { lines, records } = parser.info;
    // Note, `lines` might equal `2` even for the first record because
    // the parser already processed the second line at the time we get here.
    assert(
      /Current state is \d lines and \d records\./.test(
        `Current state is ${lines} lines and ${records} records.`,
      ),
    );
  }
});
// Report information when the process is finished
parser.on("end", () => {
  const { lines, records } = parser.info;
  assert.equal(
    `There are ${lines} lines with ${records} records.`,
    "There are 2 lines with 2 records.",
  );
});
