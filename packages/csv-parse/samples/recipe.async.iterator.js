
const parse = require('..');
const fs = require('fs');
 
const processFile = async () => {
  records = []
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
