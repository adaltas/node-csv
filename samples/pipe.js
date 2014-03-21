
var fs = require('fs');
var parse = require('../lib');
var transform = require('../../csv-transform');

output = [];
parser = parse({delimiter: ':'})
input = fs.createReadStream('/etc/passwd');
transformer = transform(function(row, callback){
  setTimeout(function(){
    callback(null, row.join(' ')+'\n');
  }, 500);
}, {parallel: 10});
input.pipe(parser).pipe(transformer).pipe(process.stdout);

