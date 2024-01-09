
import assert from 'node:assert';
import { parse } from 'csv-parse/sync';

const output = parse(`
# Illustrate the usage of comment_no_infix
a,b#,c
`.trim(), {
  comment: '#',
  comment_no_infix: true
});

assert.deepStrictEqual(output, [
  ['a', 'b#', 'c']
]);
