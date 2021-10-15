
import assert from 'assert';
import { parse } from 'csv-parse/sync';

const records = parse(`
"a","b","c"
\t
"d","e","f"
`, {
  skip_empty_lines: true,
  trim: true
});

assert.deepStrictEqual(
  records, [
    ['a', 'b', 'c'],
    ['d', 'e', 'f']
  ]
);
