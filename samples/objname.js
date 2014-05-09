
var parse = require('..');
require('should');

parse(
  'ColumnOne,ColumnTwo\nfirst,Data\nsecond,MoreData',
  {'columns':true, 'objname': "ColumnOne"},
  function(err, data){
    if(err) throw err;
    data.should.eql({
      first: { ColumnOne: 'first', ColumnTwo: 'Data' },
      second: { ColumnOne: 'second', ColumnTwo: 'MoreData' } 
    });
  }
);
