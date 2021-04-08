
var csv = require('..');
var i = 0

var generator = csv.generate({seed: 1, columns: 2, length: 20});
var parser = csv.parse();
var transformer = csv.transform(function(data){
  i++
  return data.map(function(value){return value.toUpperCase()});
});
var stringifier = csv.stringify();

generator.on('readable', function(){
  while(data = generator.read()){
    parser.write(data);
  }
});
generator.on('end', function(){
  parser.end()
});

parser.on('readable', function(){
  while(data = parser.read()){
    transformer.write(data);
  }
});
parser.on('end', function(){
  transformer.end()
});

transformer.on('readable', function(){
  while(data = transformer.read()){
    stringifier.write(data);
  }
});
transformer.on('end', function(){
  stringifier.end();
});

stringifier.on('readable', function(){
  while(data = stringifier.read()){
    process.stdout.write(data);
  }
});
generator.on('end', function(){
  process.stdout.write('=> ' + i + ' records\n');
});


