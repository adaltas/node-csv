
import fs from 'fs'
import parse from '../lib/index.js'

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
  for await (const record of parser) {
    // Work with each record
    records.push(record)
  }
  return records
}

(async () => {
  const records = await processFile()
  console.info(records);
})()
