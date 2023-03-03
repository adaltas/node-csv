
import { stringify } from 'csv-stringify/sync';
import assert from 'assert';

const records = stringify([
  ['a,b']
], {
  quote: '|'
});

assert.equal(records, '|a,b|\n');
