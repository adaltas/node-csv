
import assert from 'assert';
import { parse } from 'csv-parse';

parse(`
a,b,c
, ,\t
d,e,f
`.trim(), {
  skip_records_with_empty_values: true
}, (err, records) => {
  assert.deepStrictEqual(records, [
    ['a', 'b', 'c'],
    ['d', 'e', 'f']
  ]);
});
