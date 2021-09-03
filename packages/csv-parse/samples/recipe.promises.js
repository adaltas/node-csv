
import fs from 'fs'
import parse from '../lib/index.js'
import { finished } from 'stream/promises'

import { dirname } from 'path'
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url))

const processFile = async () => {
  const records = []
  const parser = fs
  .createReadStream(`${__dirname}/fs_read.csv`)
  .pipe(parse({
    // CSV options if any
  }));
  parser.on('readable', function(){
    let record;
    while (record = parser.read()) {
      // Work with each record
      records.push(record)
    }
  });
  await finished(parser);
  return records
}

(async () => {
  const records = await processFile()
  console.info(records);
})()
