import assert from "node:assert";
import { parse } from "csv-parse";

const data = `
a,b,c
, ,\t
d,e,f
`;
parse(
  data,
  {
    skip_records_with_empty_values: true,
  },
  (err, records) => {
    assert.deepStrictEqual(records, [
      ["a", "b", "c"],
      ["d", "e", "f"],
    ]);
  },
);
