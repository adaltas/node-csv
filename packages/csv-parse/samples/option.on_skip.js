import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse";

parse(
  dedent`
    a,b,c
    invalid
    d,e,f
  `,
  {
    skip_records_with_error: true,
    on_skip: ({ message, code, record }) => {
      assert.equal(message, "Invalid Record Length: expect 3, got 1 on line 2");
      assert.equal(code, "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH");
      assert.deepStrictEqual(record, ["invalid"]);
    },
  },
  function (err, records) {
    assert.deepStrictEqual(records, [
      ["a", "b", "c"],
      ["d", "e", "f"],
    ]);
  },
);
