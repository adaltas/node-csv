
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import { parse } from 'csv-parse';
// Note, the `stream/promises` module is only available
// starting with Node.js version 16
import { finished } from 'stream/promises';

/* hide-next-line */
/* eslint-disable indent */
/* hide-next-line */
(async() => {
// Prepare the dataset
await fs.promises.writeFile(`${os.tmpdir()}/input.csv`, [
  'a,b,c',
  '1,2,3'
].join('\n'));
// Read and process the CSV file
const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`${os.tmpdir()}/input.csv`)
    .pipe(parse({
    // CSV options if any
    }));
  parser.on('readable', function(){
    let record; while ((record = parser.read()) !== null) {
    // Work with each record
      records.push(record);
    }
  });
  await finished(parser);
  return records;
};
// Parse the CSV content
const records = await processFile();
// Validate the records
assert.deepStrictEqual(records, [
  [ 'a', 'b', 'c' ],
  [ '1', '2', '3' ]
]);
/* hide-next-line */
})();
