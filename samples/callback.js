
var transform = require('..');
var should = require('should');

transform([
  ['1','2','3','4'],
  ['a','b','c','d']
], function(data){
  data.push(data.shift())
  return data;
}, function(err, output){
  output.should.eql([ [ '2', '3', '4', '1' ], [ 'b', 'c', 'd', 'a' ] ]);
});
