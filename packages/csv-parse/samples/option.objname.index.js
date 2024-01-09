
import assert from 'node:assert';
import { parse } from 'csv-parse/sync';

const records = parse('a,b,c\nd,e,f', {
  objname: 1
});

assert.deepStrictEqual(records, {
  b: ['a', 'b', 'c'],
  e: ['d', 'e', 'f']
});
