import assert from "node:assert";
import { parse } from "csv-parse";

parse(
  'a,some"text,c',
  {
    relax_quotes: true,
  },
  (err, records) => {
    assert.deepStrictEqual(records, [["a", 'some"text', "c"]]);
  },
);
