
var csv = require('..');

csv.generate({seed: 1, columns: 2, length: 20}).pipe(
csv.parse()).pipe(
csv.transform(function(record){
  return record.map(function(value){return value.toUpperCase()});
})).pipe(
csv.stringify()).pipe(process.stdout);
