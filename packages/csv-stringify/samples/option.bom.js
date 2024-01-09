
import assert from 'node:assert';
import { stringify } from 'csv-stringify/sync';

const data = stringify([
  [ 'a', 'b', 'c' ]
], {
  bom: true
});
assert.deepStrictEqual(data, '\ufeffa,b,c\n');
