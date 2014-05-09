
var parse = require('../lib');
require('should');

var input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"';
parse(input, {comment: '#'}, function(err, output){
  output.should.eql([ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]);
});
