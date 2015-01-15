
// The package "should" must be installed:   
// `npm install should`

parse = require('..');
should = require('should');

parse( "1	2	3\ra	b	c", {delimiter: '\t'}, function(err, data){
  if(err) throw err;
  data.should.eql([ [ '1', '2', '3' ], [ 'a', 'b', 'c' ] ]);
});
