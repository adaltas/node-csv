
should = require('should');
generate = require('../lib');

var data = []
var generator = generate({seed: 1, objectMode: true, columns: 2, length: 2});
generator.on('readable', function(){
  while(d = generator.read()){
    data.push(d);
  }
});
generator.on('error', function(err){
  console.log(err);
});
generator.on('end', function(){
  data.should.eql([ [ 'OMH', 'ONKCHhJmjadoA' ],[ 'D', 'GeACHiN' ] ]);
});
