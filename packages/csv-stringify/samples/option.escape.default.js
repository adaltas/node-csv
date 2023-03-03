
import { stringify } from 'csv-stringify/sync';
import assert from 'assert';

const records = stringify([
  ['a "value"'],
]);

assert.equal(records, '"a ""value"""\n')
