
import * as csv from '../lib/index.js';

let i = 0;

const generator = csv.generate({seed: 1, columns: 2, length: 20});
const parser = csv.parse();
const transformer = csv.transform(function(data){
  i++;
  return data.map(function(value){return value.toUpperCase();});
});
const stringifier = csv.stringify();

// Read generated CSV data and send it to the parser
generator.on('readable', function(){
  let data; while((data = generator.read()) !== null){
    parser.write(data);
  }
});
// When generation is over, close the parser
generator.on('end', function(){
  parser.end();
});

// Read parsed records and send them to the transformer
parser.on('readable', function(){
  let data; while((data = parser.read()) !== null){
    transformer.write(data);
  }
});
// When parsing is over, close the transformer
parser.on('end', function(){
  transformer.end();
});

// Read transformed records and send them to the stringifier
transformer.on('readable', function(){
  let data; while((data = transformer.read()) !== null){
    stringifier.write(data);
  }
});
// When transformation is over, close the stringifier
transformer.on('end', function(){
  stringifier.end();
});

// Read CSV data and print it to stdout
stringifier.on('readable', function(){
  let data; while((data = stringifier.read()) !== null){
    process.stdout.write(data);
  }
});
// When stringifying is over, print a summary to stderr
generator.on('end', function(){
  process.stderr.write('=> ' + i + ' records\n');
});
