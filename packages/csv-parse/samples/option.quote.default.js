
import assert from 'assert';
import { parse } from 'csv-parse/sync';

const records = parse(`
a,"b",c
"d",e,"f"
`.trim());

assert.deepStrictEqual(
  records, [
    ['a', 'b', 'c'],
    ['d', 'e', 'f']
  ]
);
