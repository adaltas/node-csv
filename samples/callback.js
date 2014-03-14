
should = require('should');
parse = require('../lib');

input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"';
parse(input, function(err, output){
  output.should.eql([ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]);
});
