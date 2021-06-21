
// The package "should" must be installed:   
// `npm install should`

var parse = require('..');
should = require('should')

parse(
  '#Welcome\n"1","2","3","4"\n"a","b","c","d"',
  {comment: '#'},
  function(err, data){
    data.should.eql([ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]);
  }
);

