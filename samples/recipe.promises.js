
const parse = require('..');
const fs = require('fs');
const { finished } = require('stream/promises');
 
const processFile = async () => {
  records = []
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
