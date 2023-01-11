
import assert from 'assert';
import {promises as fs} from 'fs'; // 'fs/promises' not available in node 12
import os from 'os';
import { parse } from '../lib/sync.js';

/* hide-next-line */
/* eslint-disable indent */
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
const records = parse(content, {bom: true});
// Validate the records
assert.deepStrictEqual(records, [
  [ 'a', '1' ],
  [ 'b', '2' ]
]);
/* hide-next-line */
})();
