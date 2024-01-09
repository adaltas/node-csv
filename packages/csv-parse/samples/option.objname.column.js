
import assert from 'node:assert';
import { parse } from 'csv-parse/sync';

const records = parse('c1,c2,c3\na,b,c\nd,e,f', {
  columns: true,
  objname: 'c2'
});

assert.deepStrictEqual(records, {
  b: { c1: 'a', c2: 'b', c3: 'c' },
  e: { c1: 'd', c2: 'e', c3: 'f' } 
});
