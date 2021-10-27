
import assert from 'assert';
import fs from 'fs/promises';
import os from 'os';
import { parse } from '../lib/sync.js';

/* hide-next-line */
(async() => {
// Prepare the dataset
await fs.writeFile(`${os.tmpdir()}/input.csv`, Buffer.from([
  '\ufeff',
  `a€b€c`,
  '\n',
  `d€e€f`
].join(''), 'utf16le'));
// Read the content
const content = await fs.readFile(`${os.tmpdir()}/input.csv`);
// Parse the CSV content
const records = parse(content, {
  delimiter: '€',
  encoding: 'utf16le'
});
// Validate the records
assert.deepStrictEqual(records, [
  [ '﻿a', 'b', 'c' ],
  [ 'd', 'e', 'f' ]
]);
/* hide-next-line */
})();
