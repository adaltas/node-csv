
import assert from 'assert';
import { parse } from 'csv-parse/sync';

const data = "\ufeffa,b,c\n";
const records = parse(data, {
  bom: true
});
assert.deepStrictEqual(records, [
  [ 'a', 'b', 'c' ]
]);
