
import * as csv from '../lib/index.js'

let i = 0

const generator = csv.generate({seed: 1, columns: 2, length: 20});
const parser = csv.parse();
const transformer = csv.transform(function(data){
  i++
  return data.map(function(value){return value.toUpperCase()});
});
const stringifier = csv.stringify();

generator.on('readable', function(){
  let data; while(data = generator.read()){
    parser.write(data);
  }
});
generator.on('end', function(){
  parser.end()
});

parser.on('readable', function(){
  let data; while(data = parser.read()){
    transformer.write(data);
  }
});
parser.on('end', function(){
  transformer.end()
});

transformer.on('readable', function(){
  let data; while(data = transformer.read()){
    stringifier.write(data);
  }
});
transformer.on('end', function(){
  stringifier.end();
});

stringifier.on('readable', function(){
  let data; while(data = stringifier.read()){
    process.stdout.write(data);
  }
});
generator.on('end', function(){
  process.stdout.write('=> ' + i + ' records\n');
});
