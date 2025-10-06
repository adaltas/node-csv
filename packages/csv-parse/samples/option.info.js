import assert from "node:assert";
import { parse } from "csv-parse/sync";

const data = "a,b,c";
const records = parse(data, {
  info: true,
});
assert.deepStrictEqual(records, [
  {
    info: {
      bytes: 5,
      bytes_records: 5,
      columns: false,
      comment_lines: 0,
      empty_lines: 0,
      error: undefined,
      header: false,
      index: 3,
      invalid_field_length: 0,
      lines: 1,
      raw: undefined,
      records: 1,
    },
    record: ["a", "b", "c"],
  },
]);
