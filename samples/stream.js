
var transform = require('..');
var should = require('should');

var output = [];
var transformer = transform(function(data){
  data.push(data.shift())
  return data;
});
transformer.on('readable', function(){
  while(row = transformer.read()){
    output.push(row);
  }
});
transformer.on('error', function(err){
  console.log(err.message);
});
transformer.on('finish', function(){
  output.should.eql([ [ '2', '3', '4', '1' ], [ 'b', 'c', 'd', 'a' ] ]);
});
transformer.write(['1','2','3','4']);
transformer.write(['a','b','c','d']);
transformer.end();
