
import assert from 'assert';
import { parse } from 'csv-parse/sync';

const records = parse(`
a,"b""b",c
d,"e""e",f
`.trim());

assert.deepStrictEqual(
  records, [
    ['a', 'b"b', 'c'],
    ['d', 'e"e', 'f']
  ]
);
