
import assert from 'node:assert';
import { parse } from 'csv-parse';

parse(`
a,b,c
d,e,f
`.trim(), {raw: true}, (err, records) => {
  assert.deepStrictEqual(records, [
    { record: [ 'a', 'b', 'c' ], raw: 'a,b,c\n' },
    { record: [ 'd', 'e', 'f' ], raw: 'd,e,f' }
  ]);
});
