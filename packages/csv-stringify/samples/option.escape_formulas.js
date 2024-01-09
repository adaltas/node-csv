
import { stringify } from 'csv-stringify/sync';
import assert from 'node:assert';

const records = stringify([
  ['=1', '@2', '3'],
  ['=4', '@5', '6']
], {escape_formulas: true});

assert.equal(records, "'=1,'@2,3\n'=4,'@5,6\n");
