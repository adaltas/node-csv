
should = require('should');
stringify = require('../lib');

input = [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ];
stringify(input, function(err, output){
  output.should.eql('1,2,3,4\na,b,c,d\n');
});
