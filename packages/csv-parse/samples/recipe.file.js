
import assert from 'assert';
import fs from 'fs/promises';
import os from 'os';
import { parse } from '../lib/sync.js';

/* hide-next-line */
(async() => {
// Prepare the dataset
await fs.writeFile(`${os.tmpdir()}/input.csv`, [
  '\ufeff', // BOM
  'a,1\n', // First record
  'b,2\n' // Second record
].join(''), 'utf8');
// Read the content
const content = await fs.readFile(`${os.tmpdir()}/input.csv`);
// Parse the CSV content
const records = parse(content);
// Validate the records
assert.deepStrictEqual(records, [
  [ '﻿a', '1' ],
  [ 'b', '2' ]
]);
/* hide-next-line */
})();
