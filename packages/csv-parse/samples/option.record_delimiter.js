
import assert from 'assert';
import { parse } from 'csv-parse/sync';

const data = 'a,b,c&&d,e,f';
const records = parse(data, {
  record_delimiter: '&&'
});
assert.deepStrictEqual(records, [
  [ 'a', 'b', 'c' ],
  [ 'd', 'e', 'f' ]
]);
