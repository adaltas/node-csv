
import assert from 'assert';
import { parse } from 'csv-parse';

parse(`
a,some"text,c
`.trim(), {
  relax_quotes: true
}, (err, records) => {
  assert.deepStrictEqual(records, [
    ['a', 'some"text', 'c']
  ]);
});
