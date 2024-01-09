
import fs from 'node:fs';
import { parse } from 'csv-parse';

const __dirname = new URL( '.', import.meta.url).pathname

const parser = parse({delimiter: ';'}, function(err, data){
  console.log(data);
});

fs.createReadStream(__dirname+'/fs_read.csv').pipe(parser);
