
import assert from 'assert';
import { parse } from 'csv-parse';

parse(`
a,b
c,d,e
`.trim(), {
  relax_column_count_more: true
}, (err, records) => {
  assert.deepStrictEqual(records, [
    ['a', 'b'],
    ['c', 'd', 'e']
  ]);
});
