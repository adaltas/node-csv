
import fs from 'node:fs';
import { parse } from 'csv-parse';

const __dirname = new URL( '.', import.meta.url).pathname

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`${__dirname}/fs_read.csv`)
    .pipe(parse({
    // CSV options if any
    }));
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  console.info(records);
})();
