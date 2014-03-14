
var exec = require('child_process').exec;
var fs = require('fs');
var parse = require('../lib');
var mutate = require('../../mutate');

output = [];
parser = parse({delimiter: ':'})
input = fs.createReadStream('/etc/passwd')
mutator = mutate({parallel: 100})
mutator.transform(function(row, callback){
  exec('du -hs '+row[5], function(err, stdout, stderr){
    if(!err){
      callback(null, [row[0], stdout]);
    }else{
      callback();
    }
  });
});
input.pipe(parser).pipe(mutator).pipe(process.stdout);

