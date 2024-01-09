
import assert from 'node:assert';
import { parse } from 'csv-parse/sync';

const data = `
# At the beginning of a record
"hello"
"world"# At the end of a record
`.trim();
const records = parse(data, {
  comment: "#"
});
assert.deepStrictEqual(records, [
  [ 'hello' ],
  [ 'world' ]
]);
