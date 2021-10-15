
import { parse } from 'csv-parse';
import { generate } from 'csv-generate';
import { transform } from 'stream-transform';

const generator = generate({
  length: 20
});
const parser = parse({
  delimiter: ':'
});
const transformer = transform((record, callback) => {
  setTimeout(() => {
    callback(null, record.join(' ')+'\n');
  }, 500);
}, {
  parallel: 5
});
generator.pipe(parser).pipe(transformer).pipe(process.stdout);
