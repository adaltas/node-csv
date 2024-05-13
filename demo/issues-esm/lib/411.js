import path from 'path';
import { pipeline } from 'stream/promises';
import { parse as parseCSV } from 'csv-parse';
import { Writable } from 'stream';
import { createReadStream } from 'fs';
import desm from "desm";
const __dirname = desm(import.meta.url);

async function testRecordsSkip() {
  const errors = [];
  const records = [];

  const sink = new Writable({
    objectMode: true,
    write: (_, __, callback) => {
      records.push(_);
      callback();
    },
  });

  const csvSource = createReadStream(path.join(__dirname, '411.csv'));
  const parser = parseCSV({
    skip_records_with_error: true,
    bom: true,
  });
  parser.on('skip', function (err) {
    errors.push(err);
  });

  await pipeline(csvSource, parser, sink);

  console.log({
    records,
    errors,
  });
}

testRecordsSkip().catch(console.error);
