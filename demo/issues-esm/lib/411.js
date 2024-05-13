import assert from 'node:assert';
import { createReadStream } from 'node:fs';
import { Writable } from 'node:stream'
import { finished } from 'node:stream/promises';
import desm from "desm";
import { parse } from 'csv-parse';

const __dirname = desm(import.meta.url);
const errors = []

const parser = parse({
  bom: true,
  skipRecordsWithError: true,
});
// Create a stream and consume its source
const sink = new Writable ({objectMode: true, write: (_, __, callback) => callback()})
const outStream = createReadStream(`${__dirname}/411.csv`).pipe(parser).pipe(sink);
// Catch records with errors
parser.on('skip', (e) => {
  errors.push(e);
});
// Wait for stream to be consumed
await finished(outStream);
// Catch error from skip event
assert.deepStrictEqual(errors.map(e => e.message), [
  'Invalid Record Length: expect 3, got 4 on line 5'
])
