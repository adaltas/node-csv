import { stringify } from "csv-stringify/sync";
import assert from "node:assert";

const records = stringify(
  [
    ["1", ""],
    [false, "2"],
    ["3", null],
    [undefined, "4"],
  ],
  {
    quoted: true,
  },
);

assert.equal(records, '"1",\n,"2"\n"3",\n,"4"\n');
